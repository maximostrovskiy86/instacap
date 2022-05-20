import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { Popover } from '@headlessui/react';
import { useUpload } from '@/hooks/useUpload';
import { isAnonymousState } from '@/state/userState';
import type { ProcessServerConfigFunction } from 'filepond';
import FileUpload from './FileUpload';
import Plus from './icon/Plus';

const AddButton: FC<{ group?: string }> = ({ group }) => {
  const navigate = useNavigate();
  const { uploadImage, uploadPDF } = useUpload(group);
  const isAnonymous = useRecoilValue(isAnonymousState);

  const handleProcess: ProcessServerConfigFunction = async (
    _fieldName,
    file,
    _metadata,
    load,
    error,
    progress,
    _abort
  ) => {
    if (file.type === 'application/pdf') {
      try {
        await uploadPDF(file, file.name, (path: string) => {
          navigate(path);
          load('done');
        });
      } catch (err) {
        error('UPLOAD IS FAILED');
        console.log(err);
      }
    } else if (file.type.match(/^image/)) {
      try {
        await uploadImage(file, file.name, progress, (path: string) => {
          // console.log(path);
          navigate(path);
          load('done');
        });
      } catch (err) {
        error('UPLOAD IS FAILED');
        console.log(err);
      }
    } else {
      error('FORMAT IS NOT ALLOWED');
    }
  };

  if (isAnonymous) return null;

  return (
    <Popover className="relative sm:order-first">
      <Popover.Button className="has-tooltip relative flex justify-center items-center w-full h-10 opacity-30 border-black border-2 border-dashed rounded-lg hover:opacity-100 sm:h-full sm:w-full sm:px-3">
        <Plus />
        <span className="tooltip mt-14">ADD FILE</span>
      </Popover.Button>
      <Popover.Panel className="border-3 border-black fixed flex w-60 h-44 rounded-xl -mt-2 ml-2 shadow-xl items-center justify-center z-999999 sm:bottom-2 sm:ml-2 sm:left-0 sm:mt-0 sm:w-10/12">
        <div className="w-full h-full">
          <FileUpload process={handleProcess} />
        </div>
      </Popover.Panel>
    </Popover>
  );
};

export default AddButton;
