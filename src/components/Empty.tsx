import SignInOut from './sidebar/SignInOut';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { sidebarState } from '@/state/uiState';
import { currentUserInfoState } from '@/state/userState';
import type { User } from 'firebase/auth';

const Upload = () => {
  const setSidebar = useSetRecoilState(sidebarState);

  const handleUpload = () => {
    setSidebar(true);
  };

  return (
    <div
      className="w-full h-full flex justify-center items-center cursor-pointer"
      onClick={handleUpload}
    >
      Upload
    </div>
  );
};

const Empty = () => {
  const currentUserInfo = useRecoilValue(currentUserInfoState) as User;
  return (
    <div className="flex flex-col w-10/2 h-full justify-center pb-36 ml-10 sm:ml-0 sm:mt-32">
      <div className="header1 mb-1">No captures yet.. 🙈</div>
      <div className="text-md text-black text-opacity-70">
        Use{' '}
        <a
          className="underline text-pink"
          href="https://chrome.google.com/webstore/detail/instacap/jompclhalmbigbmjogfnfjkomponodhk"
        >
          Instacap for Chrome
        </a>{' '}
        to capture and annotate on webpages. Or &nbsp;
        <span className="underline inline-block text-pink">
          {' '}
          {!currentUserInfo.isAnonymous ? <Upload /> : <SignInOut />}{' '}
        </span>{' '}
        <p>to collaborate in-context on pdf's, images and more 👍</p>
      </div>
    </div>
  );
};

export default Empty;
