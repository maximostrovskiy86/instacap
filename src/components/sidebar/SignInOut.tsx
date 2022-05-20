import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { currentUserInfoState } from '@/state/userState';
import type { User } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';

const LogInOut = () => {
  const currentUserInfo = useRecoilValue(currentUserInfoState) as User;
  const { linkToGoogle, signOut } = useAuth();
  useEffect(() => {}, [currentUserInfo.isAnonymous]);

  const handleClick = () => {
    linkToGoogle();
  };

  if (!currentUserInfo) return null;

  if (currentUserInfo.isAnonymous) {
    return (
      <div
        className="has-tooltip w-full h-full flex justify-center items-center cursor-pointer"
        onClick={handleClick}
      >
        Sign In
        <span className="tooltip-notuppercase mt-10 lowercase font-normal tracking-normal">
          to collaborate on captures, pdf's & more
        </span>
      </div>
    );
  }
  if (!currentUserInfo.isAnonymous) {
    return (
      <div
        className="w-full h-full flex justify-center items-center cursor-pointer"
        onClick={signOut}
      >
        Sign out
      </div>
    );
  }
  return null;
};

export default LogInOut;
