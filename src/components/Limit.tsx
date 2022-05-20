import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Capture from './capture/Capture';
import Template from './modal/Template';

const Limit = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { linkToGoogle } = useAuth();

  const closeModal = () => {
    navigate('/');
    setIsOpen(false);
  };

  const handleClick = () => {
    linkToGoogle(closeModal);
  };

  return (
    <>
      <Capture />
      <Template isOpen={isOpen} closeModal={closeModal}>
        <div className="inline-block w-full max-w-lg p-6 mb-36 overflow-hidden text-left align-middle transition-all transform rounded-2xl">
          {/* <Dialog.Title as="h3" className="text-2xl text-gray-900 leading-8">
            🙈 You’ve reached the max number of shareable capture links (3).
            Sign-in to access all your captures and continue sharing capture
            links.
          </Dialog.Title> */}
          <div className="mt-2">
            <p className="text-xl text-gray-900 leading-snug">
              🙈 You’ve reached the max number of capture links (3). Sign-in to create more capture links, collaborate on PDF's and more.
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
    </>
  );
};

export default Limit;
