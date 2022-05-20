import { atom } from 'recoil';

export const modifyCommentState = atom<{ content: string; index: number }>({
  key: 'ModifyComment',
  default: { content: '', index: -1 },
});

export const commentTypeState = atom<Capture.CommentType>({
  key: 'CommentType',
  default: 'POST',
});

export const DEFAULT_CURRENT_COMMENT: Capture.CurrentComment = {
  commentIndex: -1,
  replyIndex: -1,
  content: '',
  isPost: false,
  isBeingModify: false,
  type: 'POST',
  modifyType: 'WRITE',
  timestamp: 0,
};

export const currentCommentState = atom<Capture.CurrentComment>({
  key: 'CurrentComment',
  default: {
    ...DEFAULT_CURRENT_COMMENT,
  },
});
