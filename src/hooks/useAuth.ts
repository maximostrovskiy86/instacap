import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { appState, hasAuthProblemState } from '@/state/appState';
import { currentUserIDState, currentUserInfoState } from '@/state/userState';
import * as firebase from '@/lib/firebase/auth';
import * as firestore from '@/lib/firebase/firestore';
import { isNeedEmailState } from '@/state/userState';
// import type { User } from 'firebase/auth';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { syncWithExtensionState } from '@/state/uiState';
import { useIntercom } from './useIntercom';

export const useAuth = () => {
  const isNeedEmail = useRecoilValue(isNeedEmailState);
  const [isReady, setIsReady] = useRecoilState(appState);
  const [currentUserID, setCurrentUserID] = useRecoilState(currentUserIDState);
  const [currentUserInfo, setCurrentUserInfo] =
    useRecoilState(currentUserInfoState);
  const setSyncWithExtension = useSetRecoilState(syncWithExtensionState);
  const setHasAuthProblem = useSetRecoilState(hasAuthProblemState);
  const navigate = useNavigate();
  const intercom = useIntercom();

  const setAuth = async (user: User) => {
    setCurrentUserID(user.uid);
    if (user.isAnonymous) {
      const storedUserInfo = await getStoredUserInfo(user.uid);
      if (storedUserInfo?.email) {
        setCurrentUserInfo({ ...user.toJSON(), email: storedUserInfo.email });
        intercom.setting({ ...user.toJSON(), email: storedUserInfo.email });
        return false;
      }
    }
    setCurrentUserInfo(user.toJSON());
    intercom.setting(user.toJSON());
  };

  console.log('navigate', navigate);

  const linkToGoogle = (cb?: Function) => {
    setIsReady(false);
    firebase.linkToGoogle(
      () => {
        setIsReady(true);
        cb && cb();
      },
      (user: User) => {
        setAuth(user);
      }
    );
  };

  const signOut = () => {
    setIsReady(false);
    firebase.signOut(() => {
      navigate('/');
      window.location.reload();
    });
  };

  const init = (cb?: Function) => {
    intercom.init();
    return firebase.init(
      (user: User) => {
        setIsReady(true);
        setAuth(user);
        cb && cb(user);
      },
      () => {
        setIsReady(true);
      },
      () => {
        setSyncWithExtension(true);
      },
      () => {
        setHasAuthProblem(true);
      }
    );
  };

  const getUserInfo = () => {
    return currentUserInfo;
  };

  const getStoredUserInfo = async (uid: string) => {
    return (await firestore.getUser(uid)) as Capture.Creator;
  };

  const setAnonymousEmail = async (email: string) => {
    if (!isNeedEmail) return false;
    await firestore.updateUser(currentUserID, { email });
    const userInfo = firebase.getUser();
    if (userInfo) {
      setAuth(userInfo);
    }
  };

  const setAvatar = async (uid: string, photoURL: string) => {
    await firestore.updateUser(uid, { avatar: photoURL });
  };

  return {
    isReady,
    currentUserID,
    linkToGoogle,
    init,
    signOut,
    getUserInfo,
    isNeedEmail,
    setAnonymousEmail,
    getStoredUserInfo,
    setAvatar,
  };
};
