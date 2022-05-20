import { useState } from 'react';;
import LinkIcon from '../icon/LinkIcon';
import Template from '@/components/modal/Template';
import CaptureModal from '@/components/modal/CaptureModal';
import { Dialog } from '@headlessui/react';
import Close from '@/components/icon/Close';
import FileUpload from '@/components/FileUpload';

const CopyLink = () => {

  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  // @ts-ignore
  return (
    <div className="relative">
      <button
        className="btn-green-outline sm:w-full sm:hidden"
        onClick={handleOpen}
      >
        <LinkIcon />
        Share this Capture
      </button>
      {
        showModal && (
          <Template isOpen={showModal} closeModal={handleClose}>
            <div className=" w-80 bg-black text-white bg-opacity-80 inline-block w-full max-w-md p-6 mb-36 overflow-hidden text-left align-middle transition-all transform rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-2xl text-center text-gray-900 leading-8"
              >
                <div className="flex flex-row justify-between">
                  <span className="text-white">Share this board</span>
                  <div
                    className="flex items-center cursor-pointer"
                    onClick={handleClose}
                  >
                    <Close />
                  </div>
                </div>
              </Dialog.Title>
              <div className="mt-4">
                <CaptureModal />
              </div>
            </div>
          </Template>
        )
      }
    </div>
  );
};

export default CopyLink;
