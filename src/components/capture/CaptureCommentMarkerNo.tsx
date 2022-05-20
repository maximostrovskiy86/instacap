import { FC } from 'react';
import { useRecoilValue } from 'recoil';
import clsx from 'clsx';
import { marKerIndexState } from '@/state/markerState';

const CaptureCommentMarkerNo: FC<{ index: number }> = ({ index }) => {
  const marKerIndex = useRecoilValue(marKerIndexState);

  const style = clsx({
    // eslint-disable-next-line no-useless-computed-key
    ['badge-comment']: marKerIndex.index !== index,
    // eslint-disable-next-line no-useless-computed-key
    ['badge-comment-outline']: marKerIndex.index === index,
  });

  return <div className={`${style} self-end`}>{index + 1}</div>;
};

export default CaptureCommentMarkerNo;
