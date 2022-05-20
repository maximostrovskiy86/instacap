import { FC, useEffect, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import clsx from 'clsx';
import { firstCharToUpper } from '@/lib';
import { groupedByHostCaptureListState } from '@/state/captureState';
import { currentUserIDState } from '@/state/userState';
import { pathState } from '@/state/appState';
import _ from 'lodash';
import { sidebarState } from '@/state/uiState';
import ImageRenderer from '../ImageRenderer';

const CaptureItem: FC<{
  group: string;
  count: number;
  info: Capture.Info;
  list: Capture.Info[];
}> = ({ group, count, info, list }) => {
  const [commnetCount, setCommentCount] = useState(0);
  const [isSelected, setIsSelected] = useState(false);
  const path = useRecoilValue(pathState);
  const currentUserID = useRecoilValue(currentUserIDState);
  const setIsSidebarShow = useSetRecoilState(sidebarState);

  useEffect(() => {
    if (!path.cid) return;
    if (info.cid === path.cid) {
      setIsSelected(true);
    } else if (_.find(list, ['cid', path.cid])?.cid === path.cid) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setCommentCount(
      list.reduce(
        (previousValue, { comments = [] }) => previousValue + comments.length,
        0
      )
    );
  }, [info.cid, path.cid, list]);

  const selectedStyle = clsx({
    'bg-green bg-opacity-80': isSelected,
  });

  const handleClick = () => {
    setIsSidebarShow((isSideberShow) => !isSideberShow);
  };

  return (
    <Link to={`/${currentUserID}/${info.cid}`}>
      <div
        className={`${selectedStyle} max-w-80 mb-1 bg- flex flex-row items-center flex-nowrap gap-2 w-full py-3 truncate ... cursor-pointer rounded-lg pl-2 hover:bg-green hover:bg-opacity-30 sm:max-w-none`}
        onClick={handleClick}
      >
        <div className="overflow-hidden w-16 min-w-16 flex justify-center items-center rounded-lg bg-gray-400 border-2 border-solid border-gray-100">
          <ImageRenderer
            className="object-cover h-10 w-full bg-gray-200"
            src={info.url}
            key={info.url}
            alt=""
          />
        </div>
        <div className="flex-column items-start truncate ...">
          <div className="flex flex-row justify-start items-center">
            <span className="truncate ... max-w-40 lowercase">{group}</span>
            <span className="text-sm ml-1 text-gray-500 max-w-min truncate ...">
              ({count})
            </span>
          </div>
          <div className="flex flex-row truncate ... max-w-48">
            <div className="text-xs text-gray-500 underline">
              {commnetCount} Comments
            </div>
            <div className="subtext-grey-xs">
              &nbsp;- {dayjs.unix(info.createdAt).fromNow()}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const CaptureList = () => {
  const groupedByHostCaptureList = useRecoilValue(
    groupedByHostCaptureListState
  );

  return (
    <div className="flex-column divide-gray-200 divide-y">
      {groupedByHostCaptureList.map((item, index) => {
        let [group, list] = item;
        const count = list.length;
        let info = list[0];
        if (info.type === 'pdf') {
          info = _.sortBy(list, ['order'])[0];
          group = info.filename || '';
        }
        return (
          <CaptureItem
            key={index}
            group={firstCharToUpper(group)}
            count={count}
            info={info}
            list={list}
          />
        );
      })}
    </div>
  );
};

export default CaptureList;
