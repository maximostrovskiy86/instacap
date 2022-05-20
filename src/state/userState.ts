import { atom, selector } from 'recoil';
import { currentCaptureInfoState } from './captureState';
import { currentCommentState } from './commentState';
import type { User } from 'firebase/auth';

export const currentUserIDState = atom<string>({
  key: 'CurrentUserID',
  default: '',
});

export const currentUserInfoState = atom<User | {}>({
  key: 'CurrentUserInfo',
  default: {},
});

export const isAnonymousState = selector<boolean>({
  key: 'IsAnonymous',
  get: ({ get }) => {
    const currentUserInfo = get(currentUserInfoState) as User;
    return !!currentUserInfo.isAnonymous;
  },
});

export const isNeedEmailState = selector<boolean>({
  key: 'IsNeedEmail',
  get: ({ get }) => {
    const currentUserInfo = get(currentUserInfoState) as User;
    if (!currentUserInfo) return true;
    return !!currentUserInfo.isAnonymous && !currentUserInfo.email;
  },
});

export const isCaptureMineState = selector<boolean>({
  key: 'IsCaptureMine',
  get: ({ get }) => {
    const currentUserInfo = get(currentUserInfoState) as User;
    const currentCaptureInfo = get(currentCaptureInfoState) as Capture.Info;
    if (!currentCaptureInfo?.creator) return true;
    return currentUserInfo.uid !== currentCaptureInfo.creator.uid;
  },
});

export const newCommentUidsState = selector<
  { captureCreatorUid: string; userUid: string } | boolean
>({
  key: 'NewCommentUids',
  get: ({ get }) => {
    const currentUserInfo = get(currentUserInfoState) as User;
    const currentCaptureInfo = get(currentCaptureInfoState) as Capture.Info;
    if (!currentCaptureInfo?.creator) return false;
    if (currentUserInfo.uid !== currentCaptureInfo.creator.uid) {
      return {
        captureCreatorUid: currentCaptureInfo.creator.uid,
        userUid: currentUserInfo.uid,
      };
    } else {
      return false;
    }
  },
});

export const isCommentMineState = selector<boolean>({
  key: 'IsCommentMine',
  get: ({ get }) => {
    const currentUserInfo = get(currentUserInfoState) as User;
    const currentCaptureInfo = get(currentCaptureInfoState) as Capture.Info;
    const currentComment = get(currentCommentState) as Capture.CurrentComment;
    if (!currentCaptureInfo?.comments) return true;
    const comment = currentCaptureInfo.comments[currentComment.commentIndex];
    if (!comment) return true;
    return currentUserInfo.uid === comment.creator.uid;
  },
});

export const newReplyUidsState = selector<
  { replyerUids: string[]; userUid: string } | boolean
>({
  key: 'NewReplyUids',
  get: ({ get }) => {
    const currentUserInfo = get(currentUserInfoState) as User;
    const currentCaptureInfo = get(currentCaptureInfoState) as Capture.Info;
    const currentComment = get(currentCommentState) as Capture.CurrentComment;
    if (!currentCaptureInfo?.comments) return false;
    const comment = currentCaptureInfo.comments[currentComment.commentIndex];
    if (!comment) return false;

    const replyerUids = Array.from(
      new Set([
        currentUserInfo.uid,
        comment.creator.uid,
        ...(comment.replies?.map(({ creator }) => creator.uid) || []),
      ])
    );

    return {
      userUid: replyerUids.shift() || '',
      replyerUids,
    };
  },
});
