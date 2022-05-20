import { FC } from 'react';
import { Dialog } from '@headlessui/react';
import Template from './Template';
import Close from '../icon/Close';
import FileUpload from '../FileUpload';
import type { ProcessServerConfigFunction } from 'filepond';

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  onProcess: ProcessServerConfigFunction;
};

const FileUploadModal: FC<Props> = ({ isOpen, closeModal, onProcess }) => {
  return (
    <Template isOpen={isOpen} closeModal={closeModal}>
      <div className="inline-block w-full max-w-md p-6 mb-36 overflow-hidden text-left align-middle transition-all transform rounded-2xl">
        <Dialog.Title as="h3" className="text-2xl text-gray-900 leading-8">
          <div className="flex flex-row justify-between">
            <span>File Upload</span>--
            <div
              className="flex items-center cursor-pointer"
              onClick={closeModal}
            >
              <Close />
            </div>
          </div>
        </Dialog.Title>
        <div className="mt-4">
          <FileUpload process={onProcess} />
        </div>
      </div>
    </Template>
  );
};

export default FileUploadModal;
