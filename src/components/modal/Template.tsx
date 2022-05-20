import React, { Fragment, FC } from 'react';
import { Dialog, Transition } from '@headlessui/react';

type Params = {
  isOpen: boolean;
  closeModal: () => void;
  // children: React.ComponentProps<any>;
};

const Template: FC<Params> = ({ isOpen, closeModal, children }) => {
  console.log('isOpen', isOpen);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={closeModal}
      >
        <div className="danger flex items-center justify-center min-h-screen px-4 text-center">
          <Dialog.Overlay className="fixed inset-0 bg-green opacity-95" />

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="inline-block h-screen " aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {children}
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Template;
