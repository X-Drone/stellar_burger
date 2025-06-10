describe('User Authentication Flow', () => {
  it('Account Access and Dashboard Navigation', () => {
    const accountData = {
      success: true,
      user: {
        email: 'demo@stellar.com',
        name: 'Demo Account'
      }
    };

    cy.intercept('GET', 'api/auth/user', {
      statusCode: 200,
      body: accountData
    }).as('getAccountInfo');

    cy.loginByApi();
    cy.visit('/');
    cy.contains('Личный кабинет').click();
    cy.wait('@getAccountInfo');
    cy.contains(accountData.user.name).click();
    cy.url().should('include', '/profile');
    cy.get('form').should('exist', { timeout: 15000 });
    cy.get('input[name="name"]').invoke('val').should('eq', accountData.user.name);
  });
});

describe('Product Assembly Workflow', () => {
  const BASE_URL = 'http://localhost:4000';
  const RESPONSE_TIMEOUT = 15000;
  
  const COMPONENTS = {
    topBun: 'Флюоресцентная булка R2-D3',
    mainFilling: 'Биокотлета из марсианской Магнолии'
  };

  beforeEach(() => {
    // Load test fixtures
    cy.fixture('ingredients.json').as('menuData');
    cy.fixture('user.json').as('accountData');

    // Setup API mocks
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    }).as('fetchMenu');

    cy.intercept('GET', 'api/auth/user', {
      fixture: 'user.json'
    }).as('fetchAccount');

    // Setup authentication state
    cy.setCookie('accessToken', 'demoToken');
    cy.window().then(win => {
      win.localStorage.setItem('refreshToken', 'demoToken');
    });

    cy.visit('/');
    
    // Cache element references
    cy.contains('Соберите бургер').as('headline');
    cy.contains('Булки').as('bunsSection');
    cy.contains('Начинки').as('fillingsSection');
    cy.contains(COMPONENTS.topBun).as('selectedBun');
    cy.contains(COMPONENTS.mainFilling).as('selectedFilling');
    cy.contains('Оформить заказ').as('submitButton');
    
    cy.get('@headline').should('exist', { timeout: RESPONSE_TIMEOUT });
  });

  it('Empty State Validation', () => {
    ['Выберите булки', 'Выберите начинку'].forEach(text => {
      cy.contains(text).should('be.visible');
    });
  });

  it('Bun Selection Process', () => {
    cy.get('@bunsSection')
      .scrollIntoView()
      .click({ force: true })
      .parent()
      .should('have.class', 'tab_type_current');
    
    cy.get('@selectedBun')
      .scrollIntoView({ duration: 500 })
      .next()
      .click({ force: true });
      
    cy.get('@selectedBun')
      .should('be.visible', { timeout: RESPONSE_TIMEOUT });
  });

  it('Filling Selection Process', () => {
    cy.get('@fillingsSection')
      .scrollIntoView()
      .click({ force: true });
      
    cy.get('@selectedFilling')
      .next()
      .click();
      
    cy.get('@selectedFilling')
      .should('be.visible');
  });

  it('Order Creation Flow', () => {
    cy.intercept('POST', 'api/orders', {
      fixture: 'makeOrder.json',
      statusCode: 200
    }).as('processOrder');

    cy.get('@selectedBun').next().click();
    cy.get('@fillingsSection').scrollIntoView();
    cy.get('@selectedFilling').next().click();

    cy.get('@submitButton')
      .should('not.be.disabled')
      .click();

    cy.wait('@processOrder', { timeout: 35000 })
      .its('response.statusCode')
      .should('eq', 200);

    cy.contains('идентификатор заказа').should('be.visible');
    cy.get('body').type('{esc}');
    cy.contains('Выберите булки').should('be.visible');
  });

  it('Component Details Modal Management', () => {
    cy.contains(COMPONENTS.topBun).click();
    cy.url().should('include', '/ingredients/');
    cy.get('body').type('{esc}');
    cy.url().should('eq', `${BASE_URL}/`);
  });

  it('Modal Dismissal Interaction', () => {
    cy.contains(COMPONENTS.topBun).click();
    cy.get('body').click(10, 10);
    cy.url().should('eq', `${BASE_URL}/`);
  });
});