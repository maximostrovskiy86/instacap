import { useState } from 'react';
import LinkIcon from '../icon/LinkIcon';
import Template from '@/components/modal/Template';
import CaptureModal from '@/components/modal/CaptureModal';
import { Dialog } from '@headlessui/react';
import { ToastContainer } from 'react-toastify';
import Close from '@/components/icon/Close';
import { useRecoilValue } from 'recoil';
import { isAnonymousState } from '@/state/userState';
import { useFunction } from '@/hooks/useFunction';
// import FileUpload from '@/components/FileUpload';

const CopyLink = () => {
  const [showModal, setShowModal] = useState(false);
  const isAnonymous = useRecoilValue<boolean>(isAnonymousState);
  const { copyLinkToClipboard } = useFunction();

  const handleOpen = () => {
    if (isAnonymous) {
      copyLinkToClipboard();
      return;
    }

    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div className="relativetext-black">
      <button
        className="btn-green-outline sm:w-full sm:hidden"
        onClick={handleOpen}
      >
        <LinkIcon />
        Share this Capture
      </button>
      {showModal && (
        <Template isOpen={showModal} closeModal={handleClose}>
          <div className="w-80 bg-white border border-gray-400  inline-block w-full max-w-md p-6 mb-36 overflow-hidden text-left align-middle transition-all transform rounded-xl">
            <Dialog.Title
              as="h3"
              className="text-2xl text-center text-gray-900 leading-8"
            >
              <div className="flex flex-row justify-between">
                <h2 className="text-black font-bold text-4xl">
                  Share this board
                </h2>
                <div
                  className="flex items-center cursor-pointer"
                  onClick={handleClose}
                >
                  <Close />
                </div>
              </div>
            </Dialog.Title>
            <div className="mt-4">
              <CaptureModal copyLinkToClipboard={copyLinkToClipboard} />
            </div>
          </div>
        </Template>
      )}
      <ToastContainer closeButton={false} />
    </div>
  );
};

export default CopyLink;
