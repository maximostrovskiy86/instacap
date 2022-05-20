import { FC, useEffect, RefObject, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { captureCommentState } from '@/state/captureState';
import { sidebarState } from '@/state/uiState';
import CaptureDraggableMarker from './CaptureDraggableMarker';
import { currentUserIDState } from '@/state/userState';
import { useMarker } from '@/hooks/useMarker';

type ImgEl = RefObject<HTMLImageElement>;

const CaptureMarkerItem: FC<
  Capture.Marker & {
    index: number;
    imgEl: ImgEl;
    updatedAt: number;
    isTemp: boolean;
    isDraggable: boolean;
  }
> = ({ box, x, y, index, imgEl, updatedAt, isTemp, isDraggable }) => {
  const [markerPos, setMarkerPos] = useState({ x, y });
  const [ratio, setRatio] = useState({ x: 0.0, y: 0.0 });
  const { setMarkerPosition } = useMarker();

  const sidebar = useRecoilValue(sidebarState);

  const calcPosition = (x: number, y: number) => {
    if (imgEl.current) {
      const { width, height } = box;
      const imageW = imgEl.current.width;
      const imageH = imgEl.current.height;
      const calcX = x * (imageW / width);
      const calcY = y * (imageH / height);
      setRatio({ x: imageW / width, y: imageH / height });
      // set useState
      setMarkerPos({ x: calcX, y: calcY });
      // set to state store
      setMarkerPosition(index, { x: calcX, y: calcY });
    }
  };

  useEffect(() => {
    calcPosition(x, y);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebar]);

  useEffect(() => {
    calcPosition(x, y);
    const resizeHandler = () => {
      calcPosition(x, y);
    };
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatedAt]);

  return (
    <CaptureDraggableMarker
      index={index}
      markerPos={markerPos}
      isTemp={isTemp}
      ratio={ratio}
      isDraggable={isDraggable}
    />
  );
};

const CaptureMarker: FC<{ imgEl: ImgEl }> = ({ imgEl }) => {
  const currentUserID = useRecoilValue(currentUserIDState);
  const captureComment = useRecoilValue(captureCommentState);
  useEffect(() => {}, [captureComment]);
  return (
    <>
      {captureComment.map(({ marker, updatedAt, isTemp, creator }, index) => (
        <CaptureMarkerItem
          key={index}
          index={index}
          imgEl={imgEl}
          updatedAt={updatedAt}
          isTemp={!!isTemp}
          isDraggable={currentUserID === creator.uid}
          {...marker}
        />
      ))}
    </>
  );
};

export default CaptureMarker;
