import { useEffect, useState } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { currentCaptureInfoState } from '@/state/captureState';
import * as firestore from '@/lib/firebase/firestore';

export const useCreator = () => {
  const [creator, setCreator] = useState<Capture.Creator | null>(null);
  const currentCaptureInfo = useRecoilValue(currentCaptureInfoState);

  const getCreatorInfo = useRecoilCallback(({ snapshot }) => () => {
    // console.log(currentCaptureInfo);
    const uid = currentCaptureInfo?.creator?.uid || '';
    return firestore.getUserSub(uid, (creator: any) => {
      setCreator({
        ...creator,
      });
    });
  });

  useEffect(() => {
    let unsub = () => {};
    if (currentCaptureInfo) {
      const result = getCreatorInfo();
      if (result) {
        unsub = result;
      }
    }
    return () => {
      unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCaptureInfo?.creator?.uid]);

  if (!creator) return null;

  return {
    ...creator,
    captureCreatedAt: currentCaptureInfo?.createdAt || 0,
    viewCount: currentCaptureInfo?.view?.count,
  };
};
