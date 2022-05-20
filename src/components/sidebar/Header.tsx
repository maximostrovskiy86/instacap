import { useRecoilValue } from 'recoil';
import { currentUserInfoState } from '@/state/userState';
import UserAvatar from '../UserAvatar';
import type { User } from 'firebase/auth';
import SignInOut from './SignInOut';
import { countCaptureListState } from '@/state/captureState';

const Header = () => {
  const currentUserInfo = useRecoilValue(currentUserInfoState) as User;
  const countCaptureList = useRecoilValue(countCaptureListState);

  if (!currentUserInfo) return null;

  return (
    <div className="flex items-center gap-2 pl-2 sm:px-2">
      <div className="rounded-full border-2 border-solid border-black overflow-hidden">
        <UserAvatar uid={currentUserInfo.uid} />
      </div>
      <div className="flex-colum gap-0">
        <div className="text-lg font-bold h-6 truncate ... max-w-56">
          {`My Captures (${countCaptureList})`}
        </div>
        <div className="flex items-center subtext-grey-xs">
          <span className="truncate ... max-w-48">
            {currentUserInfo.email || currentUserInfo.displayName}&nbsp;
          </span>
          <div className="flex items-center underline text-gray-500">
            (<SignInOut />)
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
