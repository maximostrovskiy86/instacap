import { MouseEvent, FC, useEffect, RefObject } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMixpanel } from '@/hooks/useMixpanel';
import { UserInfo } from 'firebase/auth';

const CaptureCommentEmailInput: FC<{
  isClicked: boolean;
  inputEl: RefObject<HTMLInputElement>;
}> = ({ isClicked, inputEl }) => {
  const { isNeedEmail, setAnonymousEmail, getUserInfo } = useAuth();
  const { setUser } = useMixpanel();

  useEffect(() => {
    if (!isNeedEmail || !inputEl || !inputEl.current) return;
    if (isClicked) {
      if (inputEl.current?.value) {
        setAnonymousEmail(inputEl.current?.value);
        const userInfo = getUserInfo() as UserInfo;
        console.log(userInfo);
        if (userInfo?.uid) {
          setUser(
            inputEl.current?.value,
            userInfo.displayName || '',
            userInfo.uid
          );
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClicked]);

  if (!isNeedEmail) return null;

  return (
    <div
      className="relative flex w-full flex-wrap items-stretch mb-2"
      onClick={(event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <input
        ref={inputEl}
        type="email"
        placeholder="Email address"
        className="focus:outline-black text-sm rounded-lg h-9 flex bg-gray-100 align-center justify-center px-2 w-full resize-none"
      />
    </div>
  );
};

export default CaptureCommentEmailInput;
