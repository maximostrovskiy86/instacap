import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { useParams } from 'react-router-dom';
import { pathState } from '@/state/appState';
import { useMixpanel } from './useMixpanel';

export const usePath = () => {
  const {
    uid,
    cid,
    gid = '',
  } = useParams() as {
    uid: string;
    cid: string;
    gid: string;
  };

  const setPath = useSetRecoilState(pathState);

  const mixpanel = useMixpanel();

  useEffect(() => {
    setPath({ uid, cid, gid });
    mixpanel.send('visit_page', { path: window.location.pathname });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, cid, gid]);
};
