import { useEffect } from 'react';
import { useRecoilValue, useRecoilCallback } from 'recoil';
import { currentUserIDState } from '@/state/userState';
import { captureListState } from '@/state/captureState';

import * as firebase from '@/lib/firebase/firestore';

let unsub: Function | null = null;

const GetCaptureList = () => {
  const currentUserID = useRecoilValue(currentUserIDState);

  const getCaptureList = useRecoilCallback(
    ({ set }) =>
      () => {
        firebase.getList(currentUserID, (list: Capture.Info[]) => {
          set(captureListState, list);
        });

        return firebase.getSub(currentUserID, (data: Capture.Info) => {
          set(captureListState, (old) => [data, ...old]);
        });
      },
    [currentUserID]
  );

  useEffect(() => {
    if (!currentUserID) return;
    if (unsub) {
      unsub();
    }
    unsub = getCaptureList();
    return () => {
      unsub && unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserID]);
  return null;
};

export default GetCaptureList;
