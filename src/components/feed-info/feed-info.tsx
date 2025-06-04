import { FC } from 'react';
import { useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { getFeedState } from '../../services/slices/feedSlice/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const { orders, total, totalToday } = useSelector(getFeedState);
  const feed = { orders, total, totalToday };
  const readyOrders = getOrders(orders, 'done');
  const pendingOrders = getOrders(orders, 'pending');
  console.log(feed);

  return (
    <FeedInfoUI
      feed={feed}
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
    />
  );
};
