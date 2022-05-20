import { currentUserInfoState } from '@/state/userState';
import { User } from 'firebase/auth';
import { useCallback } from 'react';
import * as mixpanel from 'react-mixpanel-browser';
import { useRecoilCallback } from 'recoil';

export const useMixpanel = () => {
  const mix = mixpanel.useMixpanel();

  const send = useRecoilCallback(
    ({ snapshot }) =>
      async (eventName: string, data: object = {}) => {
        const { email, displayName, uid } = (await snapshot.getLoadable(
          currentUserInfoState
        ).contents) as User;
        if (!email || !mix || !mix.config?.token) return;
        console.log(eventName);
        mix.track(eventName, { email, name: displayName, uid, ...data });
      }
  );

  const setUser = useCallback((email: string, name: string, uid: string) => {
    if (mix?.config.token && email) {
      mix.identify(email);
      mix.people.set({
        $name: name,
        $email: email,
        $uid: uid,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAvatar = useCallback((photoUrl: string) => {
    mix.people.set({
      $avatar: photoUrl,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    setUser,
    setAvatar,
    send,
  };
};
