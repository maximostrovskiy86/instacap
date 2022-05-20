import { Outlet } from 'react-router';
import { useRecoilValue } from 'recoil';
import { Toaster } from 'react-hot-toast';
import { currentCaptureInfoState } from '@/state/captureState';
import Header from './header/Header';
import CaptureInfo from './capture/CaptureInfo';
import CollapseButton from './CollapseButton';
import Sidebar from './sidebar/Sidebar';
import Empty from './Empty';
import { usePath } from '@/hooks/usePath';
import { usePublic } from '@/hooks/usePublic';
import Loading from './Loading';

const Layout = () => {
  usePath();
  usePublic();
  const currentCaptureInfo = useRecoilValue(currentCaptureInfoState);
  return (
    <>
      <Outlet />
      <Toaster
        position="top-center"
        containerClassName=""
        toastOptions={{
          className: '',
          icon: '✅',
          duration: 5000,
          style: {
            fontSize: '16px',
            background: '#000000de',
            color: '#fff',
            padding: 'auto 25px auto 25px',
            minWidth: '200px',
            height: '52px',
            borderRadius: '10px',
            boxShadow:
              'rgba(0, 0, 0, 0.6) 0px 19px 38px, rgba(0, 0, 0, 0.22) 0px 15px 12px',
          },
        }}
      />
      <div className="w-screen h-screen flex flex-row bg-gray-100 overflow-y-auto overflow-x-hidden font-sans sm:flex-col">
        <Sidebar />
        <div className="w-full px-4 pt-4 pb-14 flex flex-row sm:flex-col sm:relative ">
          {<CollapseButton />}
          <div className="flex-auto flex-column h-full w-full">
            {currentCaptureInfo === undefined ? (
              <Loading />
            ) : currentCaptureInfo === null ? (
              <Empty />
            ) : (
              <>
                <Header />
                <CaptureInfo />
              </>
            )}
            <div className="fixed bottom-0 left-0 p-5 sm:left-3 sm:px-0">
              <a href="https://app.instacap.co">
                <img src="/image/instacap-logo.png" alt="instacap-logo" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
