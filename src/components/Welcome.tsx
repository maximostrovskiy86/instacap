import { useAuth } from '@/hooks/useAuth';
import { useIntercom } from '@/hooks/useIntercom';
import { useMixpanel } from '@/hooks/useMixpanel';
import { useQuerystring } from '@/hooks/useQuerystring';
import { currentUserInfoState } from '@/state/userState';
import { UserInfo } from 'firebase/auth';
import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

const Welcome = () => {
  const { init, setAnonymousEmail } = useAuth();
  const { setting } = useIntercom();
  const { getQs } = useQuerystring();
  const mixpanel = useMixpanel();

  const userInfo = useRecoilValue(currentUserInfoState) as UserInfo;

  const email = getQs('email');

  const id = getQs('id');

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userInfo?.uid && email) {
      setAnonymousEmail(email);
      const { uid, displayName } = userInfo;
      mixpanel.setUser(email, displayName || '', uid);
      mixpanel.send('welcome', { email, name: displayName, uid, googleId: id });
      setting({ email, displayName, uid });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return (
    <iframe
      className="w-screen h-screen"
      title="welcome"
      src="https://instacap.co/welcome"
    />
  );
};

export default Welcome;
