import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import clsx from 'clsx';
import { sidebarState } from '@/state/uiState';
import { captureIsPublicState } from '@/state/captureState';
import { isAnonymousState } from '@/state/userState';
import { AddButton, CaptureList } from '@/components';
import Header from './Header';
import SignInOut from './SignInOut';

const Sidebar = () => {
  const isSidebarShow = useRecoilValue(sidebarState);
  const captureIsPublic = useRecoilValue(captureIsPublicState);
  const isAnonymous = useRecoilValue(isAnonymousState);

  const displayStyle = clsx({
    flex: isSidebarShow,
    hidden: !isSidebarShow,
  });

  useEffect(() => {}, [captureIsPublic]);

  return (
    <div
      className={`${displayStyle} rounded-br-xl rounded-tr-xl pb-10 max-w-96 flex-col justify-between relative w-96 bg-white pt-5 pr-5 pl-5 min-w-max shadow-md sm:w-full sm:max-w-none sm:min-h-1/3 sm:px-3 sm:pb-3`}
    >
      <Header />
      <div className="flex flex-col overflow-y-scroll h-full mt-6 mb-10 gap-2 sm:mt-6 sm:mb-0">
        <CaptureList />
        <AddButton />
        {isAnonymous && (
          <div className="flex items-center justify-center btn-outline min-h-10 font-bold tracking-wider uppercase">
            <img
              className="w-5 pb-1 -mr-6"
              src="/image/google-g-icn.png"
              alt="google-go-icon"
            />
            <SignInOut />
          </div>
        )}
        {isAnonymous && (
          <p className="text-xxs text-gray-400 text-center">
            I agree to the{' '}
            <a
              className="underline"
              href="https://www.instacap.co/terms"
              target="_blank"
              rel="noopener noreferrer"
            >
              terms
            </a>{' '}
            &{' '}
            <a
              className="underline"
              href="https://www.instacap.co/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              privacy
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
