import { MouseEvent } from 'react';
import { useRecoilState } from 'recoil';
import dayjs from 'dayjs';
import {
  currentCommentState,
  DEFAULT_CURRENT_COMMENT,
} from '@/state/commentState';
import Pencil from '../icon/Pecil';
import Trash from '../icon/Trash';
import Check from '../icon/Check';

import { useComment } from '@/hooks/useComment';

const list = [
  { text: 'Edit', Icon: Pencil, modifyType: 'EDIT' },
  { text: 'Delete', Icon: Trash, modifyType: 'DELETE' },
];

const CaptureCommentDropdown = () => {
  const [currentComment, setCurrentComment] = useRecoilState(
    currentCommentState
  );

  const { setCaptureComment } = useComment();

  return (
    <div
      className="transform -translate-x-48 z-20 relative w-56 -mt-1 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      role="menu"
      tabIndex={0}
    >
      <div className="px-1 py-1 " role="none">
        {list.map(({ text, Icon, modifyType }, index) => {
          return (
            <button
              type="button"
              key={index}
              className="text-gray-900 group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-800 hover:text-white"
              role="menuitem"
              onClick={(event: MouseEvent<HTMLButtonElement>) => {
                event.stopPropagation();
                event.preventDefault();
                setCurrentComment((old) => ({
                  ...old,
                  modifyType: modifyType as Capture.CommentModifyType,
                  timestamp: dayjs().unix(),
                }));
              }}
            >
              <Icon />
              {text}
              {modifyType === 'DELETE' &&
              currentComment.modifyType === 'DELETE' ? (
                <div className="flex w-full justify-end">
                  <div
                    className="flex items-center rounded-lg px-2 hover:text-pink"
                    onClick={() => {
                      setCaptureComment({ ...DEFAULT_CURRENT_COMMENT });
                    }}
                  >
                    <Check />
                    OK
                  </div>
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
      {/* <div className="px-1 py-1" role="none"></div> */}
    </div>
  );
};

export default CaptureCommentDropdown;
