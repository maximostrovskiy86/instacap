import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { currentUserIDState } from '@/state/userState';
import {
  captureListState,
  currentCaptureInfoState,
} from '@/state/captureState';

const NotMatch = () => {
  const navigate = useNavigate();
  const currentUserID = useRecoilValue(currentUserIDState);
  const captureList = useRecoilValue(captureListState);
  const setCurrentCaptureInfo = useSetRecoilState(currentCaptureInfoState);

  useEffect(() => {
    if (captureList.length > 0) {
      console.log('redirect to: ', `/${currentUserID}/${captureList[0].cid}`);
      navigate(`/${currentUserID}/${captureList[0].cid}`, { replace: true });
    } else {
      setCurrentCaptureInfo(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [captureList]);

  return null;
};

export default NotMatch;
