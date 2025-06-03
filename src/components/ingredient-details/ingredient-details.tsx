import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../..//services/store';
import { getIngredientState } from '../../services/slices/ingredientSlice/ingredientSlice';
import { Params, useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  const { ingredientList } = useSelector(getIngredientState);
  const { id } = useParams<Params>();

  const ingredientData = ingredientList.find((i) => {
    if (i._id === id) {
      return i;
    }
  });

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
