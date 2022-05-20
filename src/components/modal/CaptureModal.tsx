import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  captureIsPublicGroupState,
  captureIsPublicState,
  captureListAtHostState,
  currentCaptureInfoState,
} from '@/state/captureState';
// import LinkIcon from "../icon/LinkIcon";
import { useFunction } from '@/hooks/useFunction';

const CaptureModal = () => {
  const [copyLink, setCopyLink] = useState(false);

  const currentCaptureInfo = useRecoilValue(currentCaptureInfoState);
  const captureIsPublic = useRecoilValue(captureIsPublicState);
  const captureIsPublicGroup = useRecoilValue(captureIsPublicGroupState);
  const captureListAtHost = useRecoilValue(captureListAtHostState);
  const { copyLinkToClipboard, copyGroupLinkToClipboard } = useFunction();
  console.log('currentCaptureInfo', currentCaptureInfo);

  return (
    <>
      {currentCaptureInfo?.type !== 'pdf' && (
        <form className="flex flex-row items-end mt-12">
          <label className="w-full block" htmlFor="copy">
            <span className="block text-xs mb-2">Copy & share this link</span>
            <input
              className="h-10 p-2 text-xs w-full rounded-l-lg outline-0 border-0"
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
        </form>
      )}
      {(!captureIsPublic || captureIsPublicGroup) && (
        <form className="flex items-end h-9 mt-12">
          <label className="w-full ">
            <span className="block text-xs mb-2">Invite via email</span>
            <input
              className="h-10 p-2 text-xs w-full rounded-l-lg"
              type="text"
              placeholder="Enter the email"
            />
          </label>
          <button
            onClick={(e) => {
              e.preventDefault();
              copyLinkToClipboard();
            }}
            className="bg-dark-blue h-10 uppercase font-bold group gap-2 rounded-r-lg items-center px-2 py-2 text-xxs tracking-wider hover:text-black hover:bg-green"
          >
            <span className="max-w-56 whitespace-nowrap truncate .. ">
              Invite
            </span>
          </button>
        </form>
      )}
      <div className="mt-6">Invites sent: </div>
    </>
  );
};

export default CaptureModal;
