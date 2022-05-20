import { useRecoilCallback, useRecoilState } from 'recoil';
import dayjs from 'dayjs';
import * as firebase from '@/lib/firebase/firestore';
import { tempMarkerState, markerPositionListState } from '@/state/markerState';
import { currentUserInfoState } from '@/state/userState';
import { currentCaptureInfoState } from '@/state/captureState';
import { pathState } from '@/state/appState';
import {
  currentCommentState,
  DEFAULT_CURRENT_COMMENT,
} from '@/state/commentState';
import { useQuerystring } from '@/hooks/useQuerystring';

export const useMarker = () => {
  const [markerPositionList, setMarkerPositionList] = useRecoilState(
    markerPositionListState
  );
  const { setQs } = useQuerystring();
  const resetTempMarker = useRecoilCallback(({ reset }) => () => {
    reset(tempMarkerState);
  });

  const setTempMarker = useRecoilCallback(
    ({ set, snapshot }) =>
      async (args: Capture.Marker) => {
        const currentCaptureInfo = await snapshot.getLoadable(
          currentCaptureInfoState
        ).contents;
        const currentUserInfo = await snapshot.getLoadable(currentUserInfoState)
          .contents;

        const now = dayjs().unix();

        const data: Capture.Comment = {
          marker: args,
          updatedAt: now,
          content: '',
          createdAt: now,
          replies: [],
          creator: {
            uid: currentUserInfo.uid,
            displayName: currentUserInfo.displayName || '',
            email: currentUserInfo.email || '',
          },
          isTemp: true,
        };

        set(tempMarkerState, data);

        const commentIndex = currentCaptureInfo.comments?.length || 0;

        set(currentCommentState, {
          ...DEFAULT_CURRENT_COMMENT,
          commentIndex: commentIndex,
          timestamp: now,
        });

        setQs('comment', commentIndex + 1);
      }
  );

  const updateMarkerPosition = useRecoilCallback(
    ({ set, snapshot }) =>
      async ({ isTemp, dx, dy, index }) => {
        const now = dayjs().unix();
        if (isTemp) {
          const tempMarker = (await snapshot.getLoadable(tempMarkerState)
            .contents) as Capture.Comment;
          const x = tempMarker.marker.x + dx;
          const y = tempMarker.marker.y + dy;
          const newTempMarker = {
            ...tempMarker,
            updatedAt: now,
            marker: { ...tempMarker.marker, x, y },
          };
          set(tempMarkerState, newTempMarker);
        } else {
          const path = await snapshot.getLoadable(pathState).contents;
          const currentCaptureInfo = await snapshot.getLoadable(
            currentCaptureInfoState
          ).contents;
          // const currentUserInfo = await snapshot.getLoadable(currentUserInfoState)
          //   .contents;
          const { comments } = currentCaptureInfo;
          const newComments = [...comments];
          const x = newComments[index].marker.x + dx;
          const y = newComments[index].marker.y + dy;
          newComments[index] = {
            ...comments[index],
            updatedAt: now,
            marker: { ...newComments[index].marker, x, y },
          };
          set(currentCaptureInfoState, {
            ...currentCaptureInfo,
            comments: newComments,
          });
          firebase.setCaptureCommentReply(path.uid, path.cid, newComments);
        }
      }
  );

  const setMarkerPosition = (
    index: number,
    position: { x: number; y: number }
  ) => {
    setMarkerPositionList((pos) => [
      ...pos.slice(0, index),
      position,
      ...pos.slice(index),
    ]);
  };

  const getMarkerPosition = (index: number) => {
    return markerPositionList[index];
  };

  return {
    resetTempMarker,
    setTempMarker,
    updateMarkerPosition,
    setMarkerPosition,
    getMarkerPosition,
  };
};
