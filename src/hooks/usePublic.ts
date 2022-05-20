import { useEffect } from 'react';
import { useRecoilValue, useRecoilCallback, useSetRecoilState } from 'recoil';
import { useNavigate } from 'react-router-dom';
import {
  captureIsPublicState,
  captureIsPublicGroupState,
  publicCaptureListState,
  isGroupIdVerifiedState,
} from '@/state/captureState';
import { pathState } from '@/state/appState';
import { currentUserIDState } from '@/state/userState';
import * as firebase from '@/lib/firebase/firestore';
import { DocumentChangeType } from 'firebase/firestore';
import _ from 'lodash';

let unsub: Function | null = null;

export const usePublic = () => {
  const navigate = useNavigate();
  const { uid, cid, gid } = useRecoilValue(pathState);
  const setCaptureIsPublic = useSetRecoilState(captureIsPublicState);
  const setCaptureIsPublicGroup = useSetRecoilState(captureIsPublicGroupState);
  const setIsGroupIdVerified = useSetRecoilState(isGroupIdVerifiedState);
  const currentUserID = useRecoilValue(currentUserIDState);

  useEffect(() => {
    if (!uid || !cid || !currentUserID) return;
    const addViewer = async () => {
      await firebase.addViewer(uid, cid, currentUserID, () => {
        navigate('/', { replace: true });
      });
    };
    if (uid && uid !== currentUserID) {
      setCaptureIsPublic(true);
      addViewer();
    }
    if (uid && uid === currentUserID) {
      setCaptureIsPublic(false);
    }

    if (!gid) return;
    if (uid !== currentUserID && gid) {
      setCaptureIsPublicGroup(true);
    } else {
      setCaptureIsPublicGroup(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserID, uid, cid, gid]);

  const getCaptureListByGroup = useRecoilCallback(
    ({ set }) =>
      (uid: string, group: string) => {
        return firebase.getListByGroupSub(
          uid,
          group,
          (type: DocumentChangeType, data: Capture.Info) => {
            switch (type) {
              case 'added':
                set(publicCaptureListState, (old) =>
                  _.uniqBy([...old, data], 'cid')
                );
                break;
              case 'modified':
                set(publicCaptureListState, (old) => {
                  const tmp = [...old];
                  tmp.splice(_.findIndex(old, { cid: data.cid }), 1, data);
                  return tmp;
                });
                break;
              case 'removed':
                set(publicCaptureListState, (old) => {
                  const tmp = [...old];
                  tmp.splice(_.findIndex(old, { cid: data.cid }), 1);
                  return tmp;
                });
                break;
            }
          }
        );
      }
  );

  useEffect(() => {
    if (gid) {
      firebase.getGroupByGId(
        uid,
        gid,
        (uid: string, group: string) => {
          setIsGroupIdVerified(true);
          unsub = getCaptureListByGroup(uid, group);
        },
        () => {
          navigate('/', { replace: true });
        }
      );
    }
    return () => {
      unsub && unsub();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gid]);
};
