import { useRecoilValue } from 'recoil';
import { firstCharToUpper } from '@/lib';
import {
  captureListAtHostState,
  currentCaptureInfoState,
  currentCaptureInfoIndexState,
} from '@/state/captureState';

const Title = () => {
  const captureListAtHost = useRecoilValue(captureListAtHostState);
  const currentCaptureInfo = useRecoilValue(currentCaptureInfoState);
  const currentCaptureInfoIndex = useRecoilValue(currentCaptureInfoIndexState);

  const length = captureListAtHost.length;

  let number = length - currentCaptureInfoIndex;
  let title = currentCaptureInfo?.group || '';

  if (currentCaptureInfo?.type === 'pdf') {
    if (currentCaptureInfo?.filename) {
      title = currentCaptureInfo.filename;
    }
    if (currentCaptureInfo?.order) {
      number = currentCaptureInfo.order;
    }
  }

  return (
    <div className="mr-2 max-w-sm truncate ... sm:max-w-100% sm:pt-10">
      <p className="leading-tight header1 lowercase sm:pl-0 sm:max-w-100%">
        {firstCharToUpper(title)}
        {currentCaptureInfoIndex !== -1 ? `-${number}` : null}
      </p>
      <p className="subtext-grey-sm sm:max-w-90%">
        {firstCharToUpper(currentCaptureInfo?.capturedUrl || '')}
      </p>
    </div>
  );
};

export default Title;
