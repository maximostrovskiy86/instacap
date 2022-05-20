import { useRef, useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import clsx from 'clsx';
import { currentCaptureInfoState } from '@/state/captureState';
import { hoverMarkerState } from '@/state/markerState';
import { useMarker } from '@/hooks/useMarker';
import type { MouseEvent } from 'react';
import CaptureMarker from './CaptureMarker';
import Loading from '../Loading';
import { captureBoardScrollYState } from '@/state/uiState';

const getCoords = (elem: HTMLElement) => {
  const box = elem.getBoundingClientRect();
  return box;
};

const CaptureImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isShowAddComment, setIsShowAddCommnet] = useState(false);
  const currentCaptureInfo = useRecoilValue(currentCaptureInfoState);
  // const captureIsPublic = useRecoilValue(captureIsPublicState);
  const hoverMarker = useRecoilValue(hoverMarkerState);
  const [captureBoardScrollY, setCaptureBoardScrollY] = useRecoilState(
    captureBoardScrollYState
  );

  const { setTempMarker, resetTempMarker } = useMarker();
  // console.log(currentCaptureInfo);
  const borderRef = useRef<HTMLDivElement>(null);
  const addCommentRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const addCommentStyle = clsx({
    hidden: hoverMarker.index !== -1 || !isShowAddComment,
  });

  useEffect(() => {
    const borderEl = borderRef.current;
    return () => {
      setCaptureBoardScrollY(0);
      borderEl && borderEl.scrollTo(0, 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const borderEl = borderRef.current;
    if (borderEl && captureBoardScrollY > 0) {
      let posY = captureBoardScrollY - 200;
      if (posY < 0) {
        posY = 0;
      }
      borderEl.scrollTo(0, posY);
    }
  }, [captureBoardScrollY]);

  useEffect(() => {
    return () => {
      resetTempMarker();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCaptureInfo]);

  useEffect(() => {
    setIsLoaded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCaptureInfo?.cid]);

  useEffect(() => {
    // console.log(isLoaded);
    if (isLoaded) {
      const el = imgRef.current;
      if (el && currentCaptureInfo) {
        if (currentCaptureInfo?.comments?.length > 0) return;
        const coords = getCoords(el);
        setTempMarker({
          x: 60,
          y: 100,
          box: coords.toJSON(),
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  const handleClick = (event: MouseEvent<HTMLImageElement>) => {
    // if (captureIsPublic) return false;
    const el = event.currentTarget;
    const coords = getCoords(el);
    setTempMarker({
      x: event.pageX - coords.left,
      y: event.pageY - coords.top,
      box: coords.toJSON(),
    });
  };

  const handleMousemove = (event: MouseEvent<HTMLImageElement>) => {
    // if (captureIsPublic) return false;
    const el = event.currentTarget;
    const coords = getCoords(el);
    const addCommentEl = addCommentRef.current;
    if (addCommentEl) {
      addCommentEl.style.top = `${event.pageY - coords.top + 8}px`;
      addCommentEl.style.left = `${event.pageX - coords.left + 12}px`;
    }
  };

  return (
    <div
      onMouseLeave={() => {
        setIsShowAddCommnet(false);
      }}
      onMouseEnter={() => {
        setIsShowAddCommnet(true);
      }}
      ref={borderRef}
      id="capture_board"
      className={`relative  max-h-100% flex-initial w-full shadow-md ${
        isLoaded ? 'h-auto max-w-max' : 'h-full'
      } ${
        currentCaptureInfo?.type === 'pdf' ? 'min-w-70%' : ''
      } bg-white rounded-lg overflow-y-auto sm:min-h-60 sm:sticky sm:top-0 sm:z-10 sm:shadow-xl sm:max-h-80`}
    >
      {!isLoaded && <Loading />}
      <img
        crossOrigin="anonymous"
        ref={imgRef}
        className={`mx-auto h-auto bg-black w-auto  min-h-100% ${
          isLoaded ? 'visible' : 'invisible'
        } ${currentCaptureInfo?.type === 'pdf' ? 'min-w-100%' : ''}`}
        src={currentCaptureInfo?.url}
        key={currentCaptureInfo?.url}
        alt="no data"
        loading="lazy"
        onClick={handleClick}
        onMouseMove={handleMousemove}
        onLoad={async () => {
          await new Promise((r) => setTimeout(r, 250));
          setIsLoaded(true);
        }}
      />

      {/* comment markers - selected, un-selected & cursor follow div */}
      {isLoaded && currentCaptureInfo && (
        <>
          <CaptureMarker imgEl={imgRef} />
          <div
            ref={addCommentRef}
            className={`${addCommentStyle} border-2 border-white absolute whitespace-nowrap shadow-2xl font-normal tracking-wider text-white bg-black bg-opacity-70 px-2 py-1 text-xxxxs rounded-tl-md rounded-tr-2xl rounded-br-2xl rounded-bl-2xl`}
          >
            + ADD COMMENT
          </div>
        </>
      )}
    </div>
  );
};

export default CaptureImage;
