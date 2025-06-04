import { useDispatch, useSelector } from '@store';
import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getFeeds } from '../../services/slices/feedSlice/feedSlice';
import { getOrdersAll, getUserState } from '../../services/slices/useSlice/userSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const { userOrderHistory, isLoading } = useSelector(getUserState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrdersAll());
    dispatch(getFeeds());
  }, []);

  if (isLoading === true) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={userOrderHistory} />;
};
