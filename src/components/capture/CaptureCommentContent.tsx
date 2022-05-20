import { FC } from 'react';
import CaptureCommentReply from './CaptureCommentReply';

const CaptureCommentContent: FC<Capture.Reply & { commentIndex: number }> = (
  props
) => {
  return <CaptureCommentReply index={-1} {...props} />;
};

export default CaptureCommentContent;
