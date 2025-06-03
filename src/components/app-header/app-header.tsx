import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserState } from 'src/services/slices/useSlice/userSlice';

export const AppHeader: FC = () =>{
    const data = useSelector(getUserState).currentUser;
    let name = '';
    if (data?.name) name = data?.name;
    return <AppHeaderUI userName={name} />;
}
