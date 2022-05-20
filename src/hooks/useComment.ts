import { useRecoilCallback } from 'recoil';
import dayjs from 'dayjs';
import * as firebase from '@/lib/firebase/firestore';
import { pathState } from '@/state/appState';
import { tempMarkerState } from '@/state/markerState';
import { currentCaptureInfoState } from '@/state/captureState';
import { currentUserInfoState } from '@/state/userState';
import {
  commentTypeState,
  modifyCommentState,
  currentCommentState,
} from '@/state/commentState';
import { useIntercom } from './useIntercom';

export const useComment = () => {
  const intercom = useIntercom();

  const setCaptureComment = useRecoilCallback(
    ({ reset, snapshot }) =>
      async ({ content, email = '' }) => {
        const path = await snapshot.getLoadable(pathState).contents;
        const tempMarker = (await snapshot.getLoadable(tempMarkerState)
          .contents) as Capture.Comment;
        const currentComment = await snapshot.getLoadable(currentCommentState)
          .contents;
        const currentUserInfo = await snapshot.getLoadable(currentUserInfoState)
          .contents;
        const currentCaptureInfo = await snapshot.getLoadable(
          currentCaptureInfoState
        ).contents;

        const now = dayjs().unix();

        if (tempMarker) {
          let comment = { ...tempMarker, content, updatedAt: now };

          if (email && !comment.creator.email) {
            comment = {
              ...tempMarker,
              content,
              updatedAt: now,
              creator: { ...tempMarker.creator, email },
            };
          }

          delete comment.isTemp;

          firebase.setCaptureComment(path.uid, path.cid, comment);
          intercom.newComment();
          reset(tempMarkerState);
        } else {
          const {
            commentIndex,
            isPost,
            isBeingModify,
            replyIndex,
            modifyType,
          } = currentComment as Capture.CurrentComment;
          const { comments } = currentCaptureInfo;
          const newComments = [...comments];
          if (isBeingModify) {
            if (isPost) {
              if (modifyType === 'DELETE') {
                if (
                  window.confirm(
                    'Are you sure you want to delete this? All replies for this comment will also be deleted.'
                  )
                ) {
                  newComments.splice(commentIndex, 1);
                }
              } else {
                newComments[commentIndex] = {
                  ...comments[commentIndex],
                  content,
                  updatedAt: now,
                };
              }
            } else {
              if (modifyType === 'EDIT') {
                newComments[commentIndex] = {
                  ...comments[commentIndex],
                  updatedAt: now,
                  replies: [...comments[commentIndex].replies],
                };
                const updatedReply = {
                  ...newComments[commentIndex].replies[replyIndex],
                  updatedAt: now,
                  content,
                };
                newComments[commentIndex].replies.splice(
                  replyIndex,
                  1,
                  updatedReply
                );
              } else if (modifyType === 'DELETE') {
                const updatedReplies = [...newComments[commentIndex].replies];
                updatedReplies.splice(replyIndex, 1);
                newComments[commentIndex] = {
                  ...comments[commentIndex],
                  replies: [...updatedReplies],
                  updatedAt: now,
                };
              }
            }
            reset(currentCommentState);
          } else {
            const reply = {
              content,
              createdAt: now,
              updatedAt: now,
              creator: {
                uid: currentUserInfo.uid,
                displayName: currentUserInfo.displayName || '',
                email: currentUserInfo.email || email || '',
              },
            };
            newComments[commentIndex] = {
              ...comments[commentIndex],
              updatedAt: now,
              replies: [...comments[commentIndex].replies, reply],
            };
          }

          firebase.setCaptureCommentReply(path.uid, path.cid, newComments);
          intercom.newReply();
        }
      }
  );

  const setCaptureCommentReply = useRecoilCallback(
    ({ snapshot }) =>
      async ({ index, content }) => {
        const path = await snapshot.getLoadable(pathState).contents;
        const currentCaptureInfo = await snapshot.getLoadable(
          currentCaptureInfoState
        ).contents;

        const currentUserInfo = await snapshot.getLoadable(currentUserInfoState)
          .contents;

        const commentType = await snapshot.getLoadable(commentTypeState)
          .contents;
        const modifyComment = await snapshot.getLoadable(modifyCommentState)
          .contents;

        const now = dayjs().unix();

        const { comments } = currentCaptureInfo;
        const newComments = [...comments];

        if (commentType === 'SAVE') {
          newComments[index] = {
            ...comments[index],
            updatedAt: now,
            replies: [...comments[index].replies],
          };
          // console.log(newComments[index].replies[modifyComment.index]);
          const newReply = {
            ...newComments[index].replies[modifyComment.index],
            updatedAt: now,
            content,
          };

          newComments[index].replies.splice(modifyComment.index, 1, newReply);
        } else if (commentType === 'REPLY') {
          const reply = {
            content,
            createdAt: now,
            updatedAt: now,
            creator: {
              uid: currentUserInfo.uid,
              displayName: currentUserInfo.displayName || '',
              email: currentUserInfo.email || '',
            },
          };
          newComments[index] = {
            ...comments[index],
            updatedAt: now,
            replies: [...comments[index].replies, reply],
          };
        }

        firebase.setCaptureCommentReply(path.uid, path.cid, newComments);
        intercom.newReply();
      }
  );

  return {
    setCaptureCommentReply,
    setCaptureComment,
  };
};
