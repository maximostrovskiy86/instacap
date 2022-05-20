import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { pathState } from '@/state/appState';
import { useCaptureInfo } from '@/hooks/useCaptureInfo';
import { isGroupIdVerifiedState } from '@/state/captureState';

let unsub: Function | null = null;

const PublicGroup = () => {
  const { uid, cid } = useRecoilValue(pathState);
  const isGroupIdVerified = useRecoilValue(isGroupIdVerifiedState);
  const { getCaptureInfoSub } = useCaptureInfo();

  useEffect(() => {
    if (!uid || !cid || !isGroupIdVerified) return;
    unsub && unsub();
    unsub = getCaptureInfoSub(uid, cid);
    return () => {
      unsub && unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, cid, isGroupIdVerified]);

  return null;
};

export default PublicGroup;
