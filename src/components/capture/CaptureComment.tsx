import { FC, MouseEvent, useRef, useEffect } from 'react';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useRecoilValue, useRecoilState, useSetRecoilState } from 'recoil';
import { sortedCaptureCommentState } from '@/state/captureState';
import {
  currentCommentState,
  DEFAULT_CURRENT_COMMENT,
} from '@/state/commentState';
import { useMarker } from '@/hooks/useMarker';
import { useQuerystring } from '@/hooks/useQuerystring';
import CaptureCommentReply from './CaptureCommentReply';
import CaptureCommentContent from './CaptureCommentContent';
import CaptureCommentTextarea from './CaptureCommentTextarea';
import { captureBoardScrollYState } from '@/state/uiState';
import { markerPositionListState } from '@/state/markerState';

const CaptureCommentBox: FC<Capture.SortedComment> = ({
  replies,
  index,
  ...rest
}) => {
  const bottomEl = useRef<HTMLDivElement>(null);
  const [currentComment, setCurrentComment] =
    useRecoilState(currentCommentState);
  const setCaptureBoardScrollY = useSetRecoilState(captureBoardScrollYState);
  const markerPositionList = useRecoilValue(markerPositionListState);
  const { resetTempMarker } = useMarker();
  const { getQs, setQs, removeQs } = useQuerystring();

  useEffect(() => {
    if (currentComment.commentIndex === index) {
      markerPositionList[index] &&
        setCaptureBoardScrollY(markerPositionList[index].y);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markerPositionList[index]]);

  useEffect(() => {
    const commentNo = parseInt(getQs('comment') || '0') - 1;
    if (commentNo >= 0 && commentNo === index) {
      setCurrentComment(() => ({
        ...DEFAULT_CURRENT_COMMENT,
        commentIndex: index,
        type: 'REPLY',
        timestamp: dayjs().unix(),
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      bottomEl.current &&
      currentComment.commentIndex === index &&
      !currentComment.isBeingModify
    ) {
      bottomEl.current?.scrollTo({
        top: bottomEl.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replies, currentComment.timestamp]);

  useEffect(() => {
    if (rest.content && currentComment.commentIndex === index) {
      // setCurrentComment((old) => ({
      //   ...old,
      //   type: 'REPLY',
      //   timestamp: dayjs().unix(),
      // }));
      setQs('comment', index + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest.content, currentComment.timestamp]);

  const style = clsx({
    // eslint-disable-next-line no-useless-computed-key
    ['border-3 rounded-xl border-green border-solid shadow-xl']:
      currentComment.commentIndex === index,
  });

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setCurrentComment((old) => ({
      ...DEFAULT_CURRENT_COMMENT,
      commentIndex: index,
      type: old.type,
      timestamp: dayjs().unix(),
    }));
    !rest.isTemp && resetTempMarker();
    setCaptureBoardScrollY(markerPositionList[index].y);
  };

  return (
    <div
      key={index}
      className={`cursor-pointer flex w-96 max-w-xs sm:w-full sm:max-w-none mb-4 b ${style}`}
      onClick={handleClick}
      onBlur={() => {
        !rest.isTemp && removeQs('comment');
      }}
    >
      <div className="flex flex-col w-full p-3 bg-white h-auto rounded-xl">
        <div
          className="max-h-80 overflow-y-auto overflow-x-hidden"
          ref={bottomEl}
        >
          {rest.content ? (
            <CaptureCommentContent commentIndex={index} {...rest} />
          ) : null}
          {replies?.map((reply, replyIndex) => {
            if (!reply.content) return null;
            return (
              <CaptureCommentReply
                key={replyIndex}
                index={replyIndex}
                commentIndex={index}
                {...reply}
              />
            );
          })}
        </div>

        {/* comment item comment / reply input and button */}
        {currentComment.commentIndex === index &&
        !currentComment.isBeingModify ? (
          <CaptureCommentTextarea />
        ) : null}
      </div>
    </div>
  );
};

const CaptureComment = () => {
  const captureComment = useRecoilValue(sortedCaptureCommentState);

  useEffect(() => {}, [captureComment]);

  return (
    <div className="flex flex-col min-w-min max-h-100% overflow-y-auto px-2 -mx-2 sm:w-full sm:mx-0 sm:px-0 sm:overflow-visible">
      {captureComment.map(({ index, ...rest }) => (
        <CaptureCommentBox key={index} index={index} {...rest} />
      ))}
    </div>
  );
};

export default CaptureComment;
