import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  getFeeds,
  getFeedState
} from '../../services/slices/feedSlice/feedSlice';

export const Feed: FC = () => {
  const { orderList, isLoading } = useSelector(getFeedState);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getFeeds());
  }, []);

  if (isLoading) {
    return <Preloader />;
  }

  <FeedUI orders={orderList} handleGetFeeds={() => {}} />;
};
