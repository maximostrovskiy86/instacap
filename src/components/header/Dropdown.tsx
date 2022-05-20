import { useState, FC, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import {
  captureIsPublicState,
  captureIsPublicGroupState,
  currentCaptureIsPdfState,
} from '@/state/captureState';
import { useFunction } from '@/hooks/useFunction';
import Download from '../icon/Download';
import LinkIcon from '../icon/LinkIcon';
import Clipboard from '../icon/Clipboard';
import Trash from '../icon/Trash';
import Switch from '../icon/Switch';
import FileUploadModal from '../modal/FileUploadModal';

const Dropdown: FC<{ isDropdownShow: boolean }> = ({ isDropdownShow }) => {
  const [isOpen, setIsOpen] = useState(false);
  const captureIsPublic = useRecoilValue(captureIsPublicState);
  const captureIsPublicGroup = useRecoilValue(captureIsPublicGroupState);
  const currentCaptureIsPdf = useRecoilValue(currentCaptureIsPdfState);

  const {
    copyLinkToClipboard,
    copyGroupLinkToClipboard,
    copyToClipboard,
    downloadImage,
    deleteImage,
    replaceImage,
  } = useFunction();

  const list = useMemo(
    () => {
      const data = [
        {
          text: 'Copy Capture Link',
          Icon: LinkIcon,
          fn: copyLinkToClipboard,
          needPermission: false,
        },
        {
          text: 'Copy Capture Group Link',
          Icon: LinkIcon,
          fn: copyGroupLinkToClipboard,
          needPermission: !captureIsPublicGroup,
        },
        {
          text: 'Copy Image',
          Icon: Clipboard,
          fn: copyToClipboard,
          needPermission: false,
        },
        {
          text: 'Download Image',
          Icon: Download,
          fn: downloadImage,
          needPermission: false,
        },
        {
          text: 'Replace Image',
          Icon: Switch,
          fn: () => {
            setIsOpen(true);
          },
          needPermission: true,
        },
        { text: 'Delete', Icon: Trash, fn: deleteImage, needPermission: true },
      ];
      if (currentCaptureIsPdf) {
        data.shift();
      }
      return data;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [captureIsPublicGroup, currentCaptureIsPdf]
  );

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {isDropdownShow && (
        <div
          className="z-20 absolute top-4 left-0 w-56 mt-2 -ml-2 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:-ml-48"
          role="menu"
          tabIndex={0}
        >
          <div className="px-1 py-1 " role="none">
            {list.map(({ text, Icon, fn, needPermission }, index) => {
              if (captureIsPublic && needPermission) return null;
              return (
                <button
                  type="button"
                  key={index}
                  className="text-gray-900 group flex rounded-md items-center w-full px-2 py-2 text-sm hover:bg-gray-800 hover:text-white"
                  role="menuitem"
                  onClick={fn}
                >
                  <div className="flex justify-center w-6 min-w-min min-h-max mr-2">
                    <Icon />
                  </div>
                  {text}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <FileUploadModal
        isOpen={isOpen}
        closeModal={closeModal}
        onProcess={(
          _fieldName,
          file,
          _metadata,
          load: Function,
          _error,
          progress,
          _abort
        ) => {
          replaceImage(file, progress, () => {
            load();
            closeModal();
          });
        }}
      />
    </>
  );
};

export default Dropdown;
