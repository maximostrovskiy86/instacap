import { MouseEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import * as yup from 'yup';
import { currentCommentState } from '@/state/commentState';
import { useComment } from '@/hooks/useComment';
import CaptureCommentEmailInput from './CaptureCommentEmailInput';

// Dealing with Textarea Height
function calcHeight(value: string) {
  let numberOfLineBreaks = (value.match(/\n/g) || []).length;
  // min-height + lines x line-height + padding + border
  let newHeight = 20 + numberOfLineBreaks * 20 + 12 + 4;
  return newHeight;
}

const schema = yup.object().shape({ email: yup.string().email().required() });

const CaptureCommentTextarea = () => {
  const [isClicked, setIsClicked] = useState(false);

  const inputEl = useRef<HTMLInputElement>(null);
  const textareaEl = useRef<HTMLTextAreaElement>(null);
  const currentComment = useRecoilValue(currentCommentState);
  const { setCaptureComment } = useComment();

  useEffect(() => {
    if (textareaEl.current) {
      textareaEl.current.focus();
      textareaEl.current.style.height = `${calcHeight(
        textareaEl.current.value
      )}px`;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentComment.timestamp]);

  const handleClick = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const el = textareaEl.current as HTMLTextAreaElement;
    const value = el.value;
    if (!value.trim()) {
      textareaEl.current?.focus();
      return false;
    }
    if (inputEl && inputEl.current) {
      const email = inputEl.current.value;
      const result = await schema.isValid({ email });
      if (!result) {
        inputEl.current?.focus();
        return false;
      }
      !isClicked && setIsClicked(true);
      setCaptureComment({ content: value, email });
    } else {
      setCaptureComment({ content: value });
    }
    el.value = '';
    el.style.height = `${calcHeight(el.value)}px`;
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const el = event.currentTarget;
    el.style.height = `${calcHeight(el.value)}px`;
  };

  return (
    <>
      <div className="relative flex w-full flex-wrap items-stretch mb-2">
        <textarea
          ref={textareaEl}
          name="comment"
          className={
            currentComment.isBeingModify
              ? 'box-border focus:outline-none text-sm rounded-lg h-28 flex bg-gray-100 pt-2 align-center justify-center px-2 w-full resize-none'
              : 'focus:outline-black text-sm rounded-lg h-9 flex bg-gray-100 py-2 align-center justify-center px-2 w-full resize-none'
          }
          placeholder={
            currentComment.type === 'POST' ? 'Enter comment' : 'Enter reply'
          }
          autoFocus={true}
          defaultValue={currentComment.content}
          onClick={(event: MouseEvent<HTMLTextAreaElement>) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onKeyUp={handleKeyUp}
        />
      </div>
      <CaptureCommentEmailInput isClicked={isClicked} inputEl={inputEl} />
      <button
        className={
          currentComment.isBeingModify
            ? 'mb-4 btn-gray w-full'
            : 'btn-green w-full'
        }
        onClick={handleClick}
      >
        {currentComment.isBeingModify ? 'SAVE' : currentComment.type}
      </button>
    </>
  );
};

export default CaptureCommentTextarea;
