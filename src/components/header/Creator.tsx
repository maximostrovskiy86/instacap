import dayjs from 'dayjs';

import { useRecoilValue } from 'recoil';
import { useCreator } from '@/hooks/useCreator';
import { currentUserInfoState } from '@/state/userState';
import { firstCharToUpper } from '@/lib';
import { User } from 'firebase/auth';
import UserAvatar from '../UserAvatar';

const Creator = () => {
  const creator = useCreator();
  const currentUserInfo = useRecoilValue(currentUserInfoState) as User;

  if (!creator) return null;

  let displayName = creator.email
    ? `${firstCharToUpper(creator.email)} (guest)`
    : creator.displayName;

  if (!currentUserInfo.isAnonymous && creator.uid === currentUserInfo.uid) {
    displayName = currentUserInfo.displayName || creator.displayName;
  } else if (!creator.displayName?.startsWith('Guest-')) {
    displayName = creator.displayName;
  }

  return (
    <div className="flex flex-row cursor-default">
      <div className="flex flex-col justify-center items-end">
        <span className="has-tooltip text-md truncate ... max-w-56">
          {displayName}
          <span className="tooltip-notuppercase mt-0">Originally shared this</span>
        </span>
        <span className="text-xs text-gray-400 leading-3">
          Updated {`${dayjs.unix(creator.captureCreatedAt).fromNow()} - `}
          <span className="underline italic text-gray-500">{`${creator.viewCount} Views`}</span>
        </span>
      </div>
      <div className="transform scale-85 ml-1 rounded-full border-2 border-solid border-gray-600 overflow-hidden">
        <UserAvatar uid={creator.uid} />
      </div>
    </div>
  );
};

export default Creator;
