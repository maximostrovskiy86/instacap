import { useRecoilCallback } from 'recoil';
import { setCurrentCaptureInfoState } from '@/state/captureState';
import * as firebase from '@/lib/firebase/firestore';

export const useCaptureInfo = () => {
  const getCaptureInfoSub = useRecoilCallback(
    ({ set }) =>
      (uid: string, cid: string) => {
        return firebase.getCaptureInfoSub(
          uid,
          cid,
          (result: Capture.Info | null) => {
            set(setCurrentCaptureInfoState, result);
          }
        );
      }
  );

  return { getCaptureInfoSub };
};
