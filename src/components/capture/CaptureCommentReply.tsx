import { FC, MouseEvent, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useRecoilValue, useRecoilState } from 'recoil';
import clsx from 'clsx';
import { currentUserInfoState } from '@/state/userState';
import {
  currentCommentState,
  DEFAULT_CURRENT_COMMENT,
} from '@/state/commentState';
import UserAvatar from '../UserAvatar';
import CaptureCommentDropdown from './CaptureCommentDropdown';
import CaptureCommentTextarea from './CaptureCommentTextarea';
import DotsHorizontal from '../icon/DotsHorizontal';
import { firstCharToUpper } from '@/lib';
import { User } from 'firebase/auth';

const CaptureCommentReply: FC<
  Capture.Reply & { index: number; commentIndex: number }
> = ({ creator, content, updatedAt, index, commentIndex }) => {
  const currentUserInfo = useRecoilValue(currentUserInfoState) as User;

  const [isDropdownShow, setIsDropdownShow] = useState(false);
  const [currentComment, setCurrentComment] =
    useRecoilState(currentCommentState);

  const tripleDotStyle = clsx({
    'opacity-70': !isDropdownShow,
    'opacity-100 bg-gray-200': isDropdownShow,
  });

  useEffect(() => {
    if (
      currentComment.isBeingModify &&
      currentComment.commentIndex === commentIndex &&
      currentComment.replyIndex === index &&
      currentComment.modifyType !== 'EDIT'
    ) {
      setIsDropdownShow(true);
    } else {
      setIsDropdownShow(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentComment.timestamp]);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (isDropdownShow) {
      setIsDropdownShow(false);
    } else {
      setCurrentComment({
        ...DEFAULT_CURRENT_COMMENT,
        content,
        commentIndex,
        isBeingModify: true,
        isPost: index === -1,
        replyIndex: index,
        timestamp: dayjs().unix(),
      });
    }
  };

  let displayName = creator.email
    ? `${firstCharToUpper(creator.email)} (guest)`
    : creator.displayName;

  if (!currentUserInfo.isAnonymous && creator.uid === currentUserInfo.uid) {
    displayName = currentUserInfo.displayName || creator.displayName;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex w-full gap-2">
          <div className="w-10 min-w-10 rounded-full border-2 border-solid border-black overflow-hidden">
            <UserAvatar uid={creator.uid} />
          </div>
          <div className="flex flex-col w-full justify-center max-w-60">
            <div className="opacity-80 text-sm truncate .. max-w-80% leading-none">
              {displayName || 'Anonymous'}
              {creator.uid === currentUserInfo.uid ? ` (you)` : null}
            </div>
            <div className="subtext-grey-xxs opacity-80">
              {dayjs.unix(updatedAt).fromNow()}
            </div>
          </div>
        </div>
        {currentUserInfo.uid === creator.uid ? (
          <div
            className={`mr-2 w-6 hover:opacity-100 rounded-full hover:bg-gray-200 relative ${tripleDotStyle}`}
            onClick={handleClick}
            tabIndex={1}
          >
            <DotsHorizontal />
            {isDropdownShow && <CaptureCommentDropdown />}
          </div>
        ) : null}
      </div>
      <div>
        <p
          className={
            currentComment.isBeingModify && currentComment.modifyType === 'EDIT'
              ? 'hidden'
              : 'text-smaller-than-md leading-5 mb-5 whitespace-pre-line'
          }
        >
          {content}
        </p>
      </div>
      {currentComment.isBeingModify &&
      currentComment.modifyType === 'EDIT' &&
      currentComment.commentIndex === commentIndex &&
      currentComment.replyIndex === index ? (
        <CaptureCommentTextarea />
      ) : null}
    </div>
  );
};

export default CaptureCommentReply;
