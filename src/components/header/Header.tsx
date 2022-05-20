import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useFunction } from '@/hooks/useFunction';
import Title from './Title';
import Download from '../icon/Download';
import Clipboard from '../icon/Clipboard';
import DotsHorizontal from '../icon/DotsHorizontal';
import Dropdown from './Dropdown';
import Creator from './Creator';
import CopyLink from './CopyLink';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isDropdownShow, setIsDropdownShow] = useState(false);
  const { copyLinkToClipboard, copyToClipboard, downloadImage } = useFunction();

  useEffect(() => {
    if (location.search.startsWith('?link=true')) {
      navigate(location.pathname);
      setTimeout(copyLinkToClipboard, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tripleDotStyle = clsx({
    'opacity-70': !isDropdownShow,
    'opacity-100 bg-white': isDropdownShow,
  });

  const handleClickTripleDots = () => {
    setIsDropdownShow((isDropdownShow) => !isDropdownShow);
  };

  return (
    <div className="flex mt-1 mb-5 items-center h-10 justify-between sm:flex-col sm:items-start sm:h-auto sm:mb-2">
      <div className="flex items-center gap-2 sm:w-full sm:flex-col sm:items-start">
        <Title />
        <div className="flex items-center gap-2 sm:mt-3 sm:justify-between sm:w-full sm:flex-col sm:h-1">
          {/*<CopyLink isDropdownShow={isDropdownShow} setIsDropdownShow={setIsDropdownShow}/>*/}
          <CopyLink />

          <div className="flex items-center gap-1 sm:mb-3 sm:justify-between sm:w-full sm:px-6">
            <div className="w-10 h-10 hover:bg-white flex items-center justify-center rounded-lg cursor-pointer">
              <div
                onClick={copyToClipboard}
                className="has-tooltip flex items-center justify-center w-6 min-w-min min-h-max opacity-70 cursor-pointer hover:opacity-100 sm:hidden"
              >
                <span className="tooltip mt-14">COPY IMAGE</span>
                <Clipboard />
              </div>
            </div>
            <div className="w-10 h-10 hover:bg-white flex items-center justify-center rounded-lg cursor-pointer sm:hidden">
              <div
                onClick={downloadImage}
                className="has-tooltip flex items-center justify-center h-6 min-w-max min-h-max opacity-70 cursor-pointer hover:opacity-100"
              >
                <span className="tooltip mt-14">DOWNLOAD IMAGE</span>
                <Download />
              </div>
            </div>
            <div
              className={`w-10 h-10 hover:bg-white flex items-center justify-center rounded-lg cursor-pointer opacity-70 hover:opacity-100 ${tripleDotStyle} sm:-mt-32 sm:-mr-6 sm:bg-gray-100 sm:opacity-100`}
            >
              <div
                className="relative flex items-center justify-center h-1.5 min-w-max min-h-max  cursor-pointer  "
                onClick={handleClickTripleDots}
                tabIndex={1}
              >
                <DotsHorizontal />
                <Dropdown isDropdownShow={isDropdownShow} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row right-2 min-w-max sm:absolute sm:top-5 sm:right-2">
        {process.env.REACT_APP_NODE_ENV === 'development' ? (
          <div className="badge-grey-bigger flex-1 self-center mr-8">dev</div>
        ) : null}
        <Creator />
      </div>
    </div>
  );
};

export default Header;
