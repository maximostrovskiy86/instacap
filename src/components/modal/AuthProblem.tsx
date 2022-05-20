import { useRecoilState } from 'recoil';
import { Dialog } from '@headlessui/react';
import { hasAuthProblemState } from '@/state/appState';
import Template from './Template';

const AuthProblem = () => {
  const [hasAuthProblem, setHasAuthProblem] =
    useRecoilState(hasAuthProblemState);

  const closeModal = () => {
    setHasAuthProblem(false);
    window.location.reload();
  };

  const handleClick = () => {
    setHasAuthProblem(false);
    window.location.reload();
  };

  return (
    <Template isOpen={hasAuthProblem} closeModal={closeModal}>
      <div className="inline-block w-full max-w-md p-6 mb-36 overflow-hidden text-left align-middle transition-all transform rounded-2xl">
        <Dialog.Title as="h3" className="text-2xl text-gray-900 leading-8">
          🙈 Oops! Something went wrong..
        </Dialog.Title>
        <div className="mt-2">
          <p className="text-md text-black text-opacity-70 leading-5"></p>
        </div>

        <div className="mt-4">
          <button type="button" className="btn-black" onClick={handleClick}>
            RELOAD PAGE
          </button>
        </div>
      </div>
    </Template>
  );
};

export default AuthProblem;
