import { FC } from 'react';
import { useSelector } from '../..//services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { getFeedState } from '../../services/slices/feedSlice/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { orderList, totalOrders, todayOrderCount } = useSelector(getFeedState);

  const feed = { orderList, totalOrders, todayOrderCount };

  const readyOrders = getOrders(orderList, 'done');

  const pendingOrders = getOrders(orderList, 'pending');

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
