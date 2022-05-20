// import _ from 'lodash';
import dayjs from 'dayjs';
import { atom } from 'recoil';

type MarKerIndex = {
  index: number;
  timestamp: number;
};

export const marKerIndexState = atom<MarKerIndex>({
  key: 'MarKerIndex',
  default: {
    index: -1,
    timestamp: dayjs().unix(),
  },
});

export const tempMarkerState = atom<Capture.Comment | null>({
  key: 'TempMarker',
  default: null,
});

export const hoverMarkerState = atom<MarKerIndex>({
  key: 'HoverMarker',
  default: {
    index: -1,
    timestamp: dayjs().unix(),
  },
});

export const markerPositionListState = atom<{ x: number; y: number }[]>({
  key: 'MarkerPositionList',
  default: [],
});
