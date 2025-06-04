import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { getUserState } from '../../services/slices/useSlice/userSlice';
import {
  getConstructorState,
  orderBurger,
  setRequest,
  resetModal
} from '../../services/slices/constructorSlice/constructorSlice';

export const BurgerConstructor: FC = () => {
  const navigate = useNavigate();
  const { constructorItems, isOrderInProgress, currentOrder } =
    useSelector(getConstructorState);
  const isUserAuthenticated = useSelector(getUserState).isUserAuthenticated;

  const dispatch = useDispatch();

  let burger: string[] = [];
  if (!constructorItems || !Array.isArray(constructorItems.ingredients)) {
    return <div>Ингредиенты не загружены</div>;
  }
  const ingredients: string[] | void = constructorItems.ingredients.map(
    (i) => i._id
  );
  if (constructorItems.bun) {
    const bun = constructorItems.bun?._id;
    burger = [bun, ...ingredients, bun];
  }

  const onOrderClick = () => {
    if (isUserAuthenticated && constructorItems.bun) {
      dispatch(setRequest(true));
      dispatch(orderBurger(burger));
    } else if (isUserAuthenticated && !constructorItems.bun) {
      return;
    } else if (!isUserAuthenticated) {
      navigate('/login');
    }
  };
  const closeOrderModal = () => {
    dispatch(setRequest(false));
    dispatch(resetModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isOrderInProgress}
      constructorItems={constructorItems}
      orderModalData={currentOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
