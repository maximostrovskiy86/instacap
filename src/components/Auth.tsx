import { FC, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Loading from './Loading';
import { Outlet } from 'react-router';
import SyncWithExtension from '@/components/modal/SyncWithExtension';
import AuthProblem from '@/components/modal/AuthProblem';
import * as chromeExtension from '@/lib/chromeExtension';
import { useRecoilState } from 'recoil';
import { isCheckExtensionState } from '@/state/appState';
import { useMixpanel } from '@/hooks/useMixpanel';
import { User } from 'firebase/auth';
import { GetCaptureList } from '.';

const Auth: FC = () => {
  const [isSetApp, setIsSetApp] = useState(false);
  const [isCheckExtension, setIsCheckExtension] = useRecoilState(
    isCheckExtensionState
  );
  const { isReady, init, getStoredUserInfo, setAvatar } = useAuth();
  const mixpanel = useMixpanel();
  console.log('isCheckExtension,', isCheckExtension);
  console.log('isCheckExtensionState,', isCheckExtensionState);
  console.log('isReady,', isReady);
  console.log('init,', init);

  useEffect(() => {
    chromeExtension.init(() => {
      setIsCheckExtension(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isCheckExtension) return;
    const unsub = init(async (user: User) => {
      if (user && !user.isAnonymous && user.email) {
        mixpanel.setUser(user.email, user.displayName || '', user.uid);
        user.providerData.forEach((profile) => {
          if (profile.photoURL) {
            mixpanel.setAvatar(profile.photoURL);
            setAvatar(user.uid, profile.photoURL);
          }
        });
      }
      if (user && user.isAnonymous && user.email) {
        mixpanel.setUser(user.email, user.displayName || '', user.uid);
      }
      if (user && user.isAnonymous && !user.email) {
        const storedUserInfo = await getStoredUserInfo(user.uid);
        if (storedUserInfo.email) {
          mixpanel.setUser(
            storedUserInfo.email,
            user.displayName || '',
            user.uid
          );
        }
      }
      setIsSetApp(true);
    });
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCheckExtension]);

  if (!isReady || !isSetApp) {
    return <Loading />;
  }

  return (
    <>
      <GetCaptureList />
      <SyncWithExtension />
      <AuthProblem />
      <Outlet />
    </>
  );
};

export default Auth;
