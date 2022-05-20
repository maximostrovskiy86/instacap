import { useRecoilState } from 'recoil';
import { Dialog } from '@headlessui/react';
import { syncWithExtensionState } from '@/state/uiState';
import { useAuth } from '@/hooks/useAuth';
import Template from './Template';

const SyncWithExtension = () => {
  const { linkToGoogle } = useAuth();
  const [isOpen, setIsOpen] = useRecoilState(syncWithExtensionState);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleClick = () => {
    linkToGoogle(closeModal);
  };

  return (
    <Template isOpen={isOpen} closeModal={closeModal}>
      <div className="inline-block w-full max-w-md p-6 mb-36 overflow-hidden text-left align-middle transition-all transform rounded-2xl">
        <Dialog.Title as="h3" className="text-2xl text-gray-900 leading-8">
          Sync with Instacap for Chrome
        </Dialog.Title>
        <div className="mt-2">
          <p className="text-md text-black text-opacity-70 leading-5">
            Sign in again complete syncing with your Instacap extension
          </p>
        </div>

        <div className="mt-4">
          <button type="button" className="btn-black" onClick={handleClick}>
            <img
              className="w-4 pb-0.5"
              src="/image/google-g-icn.png"
              alt="google-go-icon"
            />
            SIGN IN
          </button>
        </div>
      </div>
    </Template>
  );
};

export default SyncWithExtension;
