import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import {
  getOrderByNumber,
  getOrderState
} from '../../services/slices/orderSlice/orderSlice';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const number = Number(useParams().number);
  const { ingredientList } = useSelector(getIngredientState);
  const { currentOrder, isLoading } = useSelector(getOrderState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrderByNumber(number));
  }, []);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!currentOrder || !ingredientList.length) return null;

    const date = new Date(currentOrder.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = currentOrder.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredientList.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...currentOrder,
      ingredientsInfo,
      date,
      total
    };
  }, [currentOrder, ingredientList]);

  if (!orderInfo || isLoading) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
