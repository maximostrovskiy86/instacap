import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { sidebarState } from '@/state/uiState';
import {
  captureIsPublicGroupState,
  captureIsPublicState,
  countCaptureListState,
} from '@/state/captureState';
import CaptureThumbnail from './capture/CaptureThumbnail';

const CollapseButton = () => {
  const setIsSidebarShow = useSetRecoilState(sidebarState);
  const captureIsPublic = useRecoilValue(captureIsPublicState);
  const captureIsPublicGroup = useRecoilValue(captureIsPublicGroupState);
  const countCaptureList = useRecoilValue(countCaptureListState);

  useEffect(() => {}, [captureIsPublic, captureIsPublicGroup]);

  // if (captureIsPublic && countCaptureList <= 1) {
  //   return null;
  // }

  const handleClick = () => {
    setIsSidebarShow((isSideberShow) => !isSideberShow);
  };

  return (
    <div className="flex flex-col mr-3 gap-2.5 justify-start items-center sm:pb-3 sm:pt-0 sm:items-start sm:-mb-10">
      <button
        className="relative btn btn-square btn-ghost h-14 flex items-center justify-center gap-1 text-sm rounded-lg sm:w-12 w-full hover:bg-gray-200"
        onClick={handleClick}
      >
        {!captureIsPublic && (
          <div className="absolute top-1 right-6 inline-flex items-center text-center justify-center ml-2 px-1 py-2 text-xs leading-none text-white bg-black bg-opacity-60 border-solid border-2 border-white rounded-full h-4 sm:right-0">
            {countCaptureList}
          </div>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          className="inline-block w-8 h-8 stroke-current"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>

      <CaptureThumbnail
        captureIsPublic={captureIsPublic}
        captureIsPublicGroup={captureIsPublicGroup}
      />
    </div>
  );
};

export default CollapseButton;
