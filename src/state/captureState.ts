import _ from 'lodash';
import { atom, selector } from 'recoil';
import { tempMarkerState } from './markerState';

export const isGroupIdVerifiedState = atom<boolean>({
  key: 'IsGroupIdVerified',
  default: false,
});

export const captureIsPublicGroupState = atom<boolean>({
  key: 'CaptureIsPublicGroup',
  default: false,
});

export const captureIsPublicState = atom<boolean>({
  key: 'CaptureIsPublic',
  default: true,
});

export const publicCaptureListState = atom<Capture.Info[]>({
  key: 'PublicCaptureList',
  default: [],
});

export const captureListState = atom<Capture.Info[]>({
  key: 'CaptureList',
  default: [],
});

export const currentCaptureInfoState = atom<Capture.Info | undefined | null>({
  key: 'CurrentCaptureInfo',
  default: undefined,
});

export const currentCaptureInfoIndexState = atom<number>({
  key: 'CurrentCaptureInfoIndex',
  default: -1,
});

export const currentCaptureIsPdfState = selector<boolean>({
  key: 'CurrentCaptureIsPdf',
  get: ({ get }) => {
    return get(currentCaptureInfoState)?.type === 'pdf';
  },
});

export const setCurrentCaptureInfoState = selector<
  Capture.Info | null | undefined
>({
  key: 'SetCurrentCaptureInfo',
  get: ({ get }) => {
    return get(currentCaptureInfoState);
  },
  set: ({ set, get }, value) => {
    if (!value) {
      set(currentCaptureInfoState, null);
    } else {
      const newValue = value as Capture.Info;
      set(currentCaptureInfoState, newValue);
      const captureIsPublic = get(captureIsPublicState);
      if (!captureIsPublic) {
        const list = get(captureListState);
        const index = _(list).findIndex({ cid: newValue.cid });
        const newList = [...list];
        newList.splice(index, 1, newValue);
        set(captureListState, newList);
      }
    }
  },
});

export const captureListAtHostState = selector<Capture.Info[] | []>({
  key: 'CaptureListAtHost',
  get: ({ get }) => {
    const isPublic = get(captureIsPublicState);
    if (isPublic) {
      return _.orderBy(get(publicCaptureListState), ['createdAt'], ['desc']);
    } else {
      const info = get(currentCaptureInfoState);
      if (!info) return [];
      const list = get(captureListState);
      const result = _<Capture.Info>(list)
        .filter({ group: info.group })
        .value();
      if (Array.isArray(result) && result.length > 0) {
        if (result[0].type === 'pdf') {
          return _.sortBy(result, ['order']);
        }
      }
      return result;
    }
  },
});

export const captureCommentState = selector<Capture.Comment[] | []>({
  key: 'CaptureComment',
  get: ({ get }) => {
    const info = get(currentCaptureInfoState);
    const tempMarker = get(tempMarkerState);

    if (info && info.comments && tempMarker) {
      return [...info.comments, tempMarker];
    }
    if (info && info.comments && !tempMarker) {
      return [...info.comments];
    }
    if ((!info || !info.comments) && tempMarker) return [tempMarker];
    return [];
  },
});

export const countCaptureListState = selector<number>({
  key: 'CountCaptureList',
  get: ({ get }) => {
    return get(captureListState).length;
  },
});

export const groupedByHostCaptureListState = selector({
  key: 'GroupedByHostCaptureList',
  get: ({ get }) => {
    const list = get(captureListState);
    return _<Capture.Info>(list).groupBy('group').toPairs().value();
  },
});

export const sortedCaptureCommentState = selector<Capture.SortedComment[]>({
  key: 'SortedCaptureComment',
  get: ({ get }) => {
    const comments = get(captureCommentState);
    return _(comments.map((item, index) => ({ ...item, index })))
      .orderBy(['createdAt'], ['asc'])
      .value();
  },
});
