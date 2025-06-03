import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { getUserState } from 'src/services/slices/useSlice/userSlice';
import {
  getConstructorState,
  orderBurger,
  setRequest,
  resetModal
} from '../../services/slices/constructorSlice/constructorSlice';


export const BurgerConstructor: FC = () => {
  const { burgerComponents, isOrderInProgress, currentOrder } =
    useSelector(getConstructorState);
  
  const onOrderClick = () => {
    if (!burgerComponents.selectedBun || isOrderInProgress) return;
  };
  const closeOrderModal = () => {};

  const price = useMemo(
    () =>
      (burgerComponents.selectedBun ? burgerComponents.selectedBun.price * 2 : 0) +
      burgerComponents.selectedIngredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [burgerComponents]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={isOrderInProgress}
      constructorItems={burgerComponents}
      orderModalData={currentOrder}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
