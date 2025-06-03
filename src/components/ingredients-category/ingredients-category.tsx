import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { getConstructorState } from '../../services/slices/constructorSlice/constructorSlice';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { burgerComponents } = useSelector(getConstructorState);

  const ingredientsCounters = useMemo(() => {
    const { selectedBun, selectedIngredients } = burgerComponents;
    const counters: { [key: string]: number } = {};
    selectedIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) counters[ingredient._id] = 0;
      counters[ingredient._id]++;
    });
    if (selectedBun) counters[selectedBun._id] = 2;
    return counters;
  }, [burgerComponents]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={ingredientsCounters}
      ref={ref}
    />
  );
});
