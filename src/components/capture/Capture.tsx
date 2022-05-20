import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { pathState } from '@/state/appState';
import { useCaptureInfo } from '@/hooks/useCaptureInfo';

let unsub: Function | null = null;

const Capture = () => {
  const { uid, cid } = useRecoilValue(pathState);
  const { getCaptureInfoSub } = useCaptureInfo();

  useEffect(() => {
    if (!uid || !cid) return;
    unsub && unsub();
    unsub = getCaptureInfoSub(uid, cid);
    return () => {
      unsub && unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid, cid]);
  return null;
};

export default Capture;
