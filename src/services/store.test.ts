import store, { rootReducer } from './store';

test('rootReducer', () => {
  expect(rootReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(store.getState());
});
