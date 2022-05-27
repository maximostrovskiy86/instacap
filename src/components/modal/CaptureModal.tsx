import React, { ChangeEvent, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  captureIsPublicGroupState,
  captureIsPublicState,
  // captureListAtHostState,
  currentCaptureInfoState,
} from '@/state/captureState';

// import { useFunction } from '@/hooks/useFunction';
import { useInvitation } from '@/hooks/useInvitation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Props {
  copyLinkToClipboard: () => void;
}

const emailSchema =
  /^[_a-zA-Z0-9-]+(\.[_a-zA-Z0-9-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.(([0-9]{1,3})|([a-zA-Z]{2,3})|(aero|coop|info|museum|name))$/;

const CaptureModal = ({ copyLinkToClipboard }: Props) => {
  const [copyLink, setCopyLink] = useState<boolean>(false);
  const [emailValue, setEmailValue] = useState<string>('');
  const [successEmail, setSuccessEmail] = useState<string[]>([]);

  const { setInvitation } = useInvitation();
  const currentCaptureInfo = useRecoilValue(currentCaptureInfoState);
  const captureIsPublic = useRecoilValue(captureIsPublicState);
  const captureIsPublicGroup = useRecoilValue(captureIsPublicGroupState);
  // const captureListAtHost = useRecoilValue(captureListAtHostState);
  // const { copyLinkToClipboard, copyGroupLinkToClipboard } = useFunction();
  // const { copyLinkToClipboard } = useFunction();

  console.log('captureIsPublic', captureIsPublic);
  console.log('captureIsPublicGroup', captureIsPublicGroup);
  console.log('currentCaptureInfo', currentCaptureInfo);

  const onHandleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    setEmailValue(value);
  };

  const emailValidation = (emails: string[]): boolean => {
    let isValid = true;
    emails.forEach((item) => {
      if (!emailSchema.test(item)) {
        isValid = false;
      }
    });
    return isValid;
  };

  const sendEmailInvite = async (e: any) => {
    e.preventDefault();

    const emails = emailValue
      .split(',')
      .map((email) => email.trim())
      .filter((item) => item.length > 0);
    console.log('emails', emails);

    if (!emailValidation(emails) || !emails.length) {
      toast.error('Incorrect email data!', {
        autoClose: 3000,
      });
      return false;
    }

    try {
      const result = await setInvitation(emails);
      console.log('result', result);

      if (result?.message) {
        toast.success(result.message, {
          autoClose: 3000,
        });

        setEmailValue('');
        setSuccessEmail(emails);
      } else {
        toast.error('Incorrect email data!', {
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error('Sending the board invitetion error:', err);
    }
  };

  return (
    <>
      {currentCaptureInfo?.type !== 'pdf' && (
        <form className="flex flex-col items-end mt-12">
          <div className="flex w-full items-end">
            <label className="w-full block" htmlFor="copy">
              <span className="block text-xs mb-2">Copy & share this link</span>
              <input
                className="h-10 p-2 text-xs w-full rounded-l-lg border-black outline-0 border-0 text-black"
                type="text"
                placeholder={`${window.location}`}
              />
            </label>
            <button
              onClick={(e) => {
                e.preventDefault();
                copyLinkToClipboard();
                setCopyLink(true);
              }}
              className="bg-dark-blue block h-10 uppercase font-bold group gap-2 rounded-r-lg items-center px-2 py-2 text-xxs tracking-wider hover:text-black hover:bg-green"
            >
              <span className="max-w-56 whitespace-nowrap truncate .. ">
                {copyLink ? 'Copied' : 'Copy'}
              </span>
            </button>
          </div>
          <div className="flex w-full items-end">
            <label className="w-full">
              <span className="block text-xs mb-2">Invite with email</span>
              <input
                className="h-10 p-2 text-xs w-full rounded-l-lg color-black border-black text-black"
                type="text"
                placeholder="Enter the email"
                name="email"
                value={emailValue}
                onChange={onHandleChange}
              />
            </label>
            <button
              onClick={sendEmailInvite}
              className="bg-dark-blue h-10 uppercase font-bold group gap-2 rounded-r-lg items-center px-2 py-2 text-xxs tracking-wider hover:text-black hover:bg-green"
            >
              <span className="max-w-56 whitespace-nowrap truncate .. ">
                Invite
              </span>
            </button>
          </div>
        </form>
      )}
      <div className="mt-6">
        {!successEmail ? (
          <p>'No invites sent yet..'</p>
        ) : (
          <>
            <span className="block">Invite sent to:</span>
            <ul>
              {successEmail.map((item, index) => (
                <li className="block" key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
};

export default CaptureModal;
