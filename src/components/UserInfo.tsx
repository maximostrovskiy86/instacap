import { useRecoilValue } from 'recoil';
import { currentUserIDState } from '@/state/userState';

const UserInfo = () => {
  const uid = useRecoilValue(currentUserIDState);
  return <div>{uid}</div>;
};

export default UserInfo;
