import { FC, useRef } from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { currentCommentState } from '@/state/commentState';
// import { captureIsPublicState } from '@/state/captureState';
import { hoverMarkerState } from '@/state/markerState';
import { useMarker } from '@/hooks/useMarker';

const CORRECTION_TOP = -36;
const CORRECTION_LEFT = 7;

const CaptureDraggableMarker: FC<{
  index: number;
  markerPos: { x: number; y: number };
  isTemp: boolean;
  ratio: { x: number; y: number };
  isDraggable: boolean;
}> = ({ index, markerPos, isTemp, ratio, isDraggable }) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [currentComment, setCurrentComment] =
    useRecoilState(currentCommentState);
  const setHoverMarker = useSetRecoilState(hoverMarkerState);
  // const captureIsPublic = useRecoilValue(captureIsPublicState);
  const { resetTempMarker, updateMarkerPosition } = useMarker();

  const style = clsx({
    'animate-none w-8 h-8 bg-gray-500 bg-opacity-90 text-white border-opacity-80 border-solid border-2 border-white shadow-2xl':
      currentComment.commentIndex !== index,
    'animate-breathe w-10 h-10 -mt-1 -ml-1 text-base z-50 font-bold bg-green bg-opacity-90 text-black border-solid border-3 border-black shadow-3xl':
      currentComment.commentIndex === index,
  });

  const handleClick = (
    event: MouseEvent | React.MouseEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    !isTemp && resetTempMarker();
    setCurrentComment((old) => ({
      ...old,
      commentIndex: index,
      timestamp: dayjs().unix(),
    }));
  };

  const handleMouseEnter = () => {
    setHoverMarker({ index, timestamp: dayjs().unix() });
  };

  const handleMouseLeave = () => {
    setHoverMarker({ index: -1, timestamp: dayjs().unix() });
  };

  const onStart: DraggableEventHandler = () => {
    if (nodeRef && nodeRef.current) {
      nodeRef.current.style.cursor = 'grabbing';
      nodeRef.current.style.animation = 'none';
    }
  };

  const onStop: DraggableEventHandler = (_e, data) => {
    if (nodeRef && nodeRef.current) {
      nodeRef.current.style.cursor = 'grab';
      nodeRef.current.style.animation = ''
    }
    if (data.x === 0 && data.y === 0) return;
    const dx = data.x / ratio.x;
    const dy = data.y / ratio.y;
    updateMarkerPosition({ index, isTemp, dx, dy });
  };

  // const onDrag: DraggableEventHandler = (e, data) => {};

  const dragHandlers = {
    onStart,
    // onDrag,
    onStop,
    onMouseDown: handleClick,
  };
  return (
    <Draggable
      nodeRef={nodeRef}
      position={{ x: 0, y: 0 }}
      disabled={!isDraggable}
      {...dragHandlers}
    >
      <div
        ref={nodeRef}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`cursor-pointer absolute text-sm flex justify-center items-center rounded-tl-3xl rounded-tr-3xl rounded-br-3xl rounded-bl-lg ${style}`}
        style={{
          top: `${markerPos.y + CORRECTION_TOP}px`,
          left: `${markerPos.x + CORRECTION_LEFT}px`,
        }}
        tabIndex={0}
      >
        <span>{index + 1}</span>
      </div>
    </Draggable>
  );
};

export default CaptureDraggableMarker;
