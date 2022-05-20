import { FC, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { currentUserIDState } from '@/state/userState';
import {
  captureListAtHostState,
  currentCaptureInfoIndexState,
} from '@/state/captureState';
import { pathState } from '@/state/appState';
import AddButton from '../AddButton';
import ImageRenderer from '../ImageRenderer';

const CaptureThumbnailItem: FC<{
  uid: string;
  item: Capture.Info;
  index: number;
  link: string;
}> = ({ uid, item, index, link }) => {
  const [isSelected, setIsSelected] = useState(false);
  const setCurrentCaptureInfoIndex = useSetRecoilState(
    currentCaptureInfoIndexState
  );
  const path = useRecoilValue(pathState);

  useEffect(() => {
    if (item.cid === path.cid) {
      setIsSelected(true);
      setCurrentCaptureInfoIndex(index);
    } else {
      setIsSelected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.cid, path.cid]);

  const selectedStyle = clsx({
    'border-3 border-green shadow-lg opacity-100': isSelected,
  });

  return (
    <Link to={link}>
      <div
        className={`${selectedStyle} opacity-40 border-3 border-solid border-gray-100 relative flex items-center bg-black justify-center w-full overflow-hidden h-16 max-h-20 rounded-lg hover:opacity-80 hover:border-gray-400 sm:w-28`}
      >
        <ImageRenderer
          className="object-cover h-full"
          src={item.url}
          key={item.url}
          alt={item.cid}
        />
        <div className="absolute top-0.5 right-0 w-full pt-0.5 px-1.5 flex justify-end items-center">
          <div className="flex items-center justify-center text-xxxxs text-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl rounded-bl-md w-5 min-w-6 px-2 h-5 bg-gray-500">
            {item?.comments?.length || 0}
          </div>
        </div>
      </div>
    </Link>
  );
};

const CaptureThumbnail: FC<{
  captureIsPublic: boolean;
  captureIsPublicGroup: boolean;
}> = ({ captureIsPublic, captureIsPublicGroup }) => {
  const captureListAtHost = useRecoilValue(captureListAtHostState);
  const currentUserID = useRecoilValue(currentUserIDState);
  const path = useRecoilValue(pathState);

  let group = '';

  if (captureListAtHost.length > 0) {
    group = captureListAtHost[0].group;
  }

  let uid = currentUserID;

  if (captureIsPublic) {
    uid = captureListAtHost[0]?.creator.uid || '';
  }

  return (
    <div className="flex flex-col w-24 h-full overflow-auto sm:flex-row gap-2 sm:overflow-x-auto sm:overflow-y-hidden sm:h-auto sm:w-full">
      {(!captureIsPublic || captureIsPublicGroup) &&
        captureListAtHost.map((item, index) => (
          <CaptureThumbnailItem
            key={index}
            uid={uid}
            item={item}
            index={index}
            link={
              captureIsPublicGroup
                ? `/${uid}/group/${path.gid}/${item.cid}`
                : `/${uid}/${item.cid}`
            }
          />
        ))}
      {!captureIsPublic && captureListAtHost.length >= 1 && (
        <AddButton group={group} />
      )}
    </div>
  );
};

export default CaptureThumbnail;
