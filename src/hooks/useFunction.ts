import { useRecoilCallback } from 'recoil';
import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import _ from 'lodash';
import * as firebase from '@/lib/firebase/firestore';
import * as storage from '@/lib/firebase/storage';
import { pathState } from '@/state/appState';
import { currentUserIDState } from '@/state/userState';
import {
  currentCaptureInfoState,
  captureListState,
  currentCaptureInfoIndexState,
  captureListAtHostState,
} from '@/state/captureState';

export const useFunction = () => {
  const navigate = useNavigate();

  const copyLinkToClipboard = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          const pathInfo = await snapshot.getLoadable(pathState).contents;
          const urlInfo = new URL(window.location.href);
          const url = `${urlInfo.origin}/${pathInfo.uid}/${pathInfo.cid}`;
          await navigator.clipboard.writeText(url);
          toast.success('Capture Link Copied!');
        } catch (error) {
          console.log(error);
        }
      },
    []
  );

  const copyGroupLinkToClipboard = useRecoilCallback(
    ({ snapshot }) =>
      async () => {
        try {
          const currentCaptureInfo = (await snapshot.getLoadable(
            currentCaptureInfoState
          ).contents) as Capture.Info;
          const pathInfo = await snapshot.getLoadable(pathState).contents;
          const urlInfo = new URL(window.location.href);
          const groupId = await firebase.setGId(
            pathInfo.uid,
            currentCaptureInfo.group
          );
          const url = `${urlInfo.origin}/${pathInfo.uid}/group/${groupId}/${pathInfo.cid}`;
          await navigator.clipboard.writeText(url);
          toast.success('Group Capture Link Copied!');
        } catch (error) {
          console.log(error);
        }
      },
    []
  );

  const copyToClipboard = useRecoilCallback(({ snapshot }) => async () => {
    const currentCaptureInfo = await snapshot.getLoadable(
      currentCaptureInfoState
    ).contents;

    try {
      await navigator.clipboard.writeText(currentCaptureInfo.url);
      toast.success('Image Copied!');
    } catch (error) {
      console.log(error);
    }
  });

  const downloadImage = useRecoilCallback(({ snapshot }) => async () => {
    const currentCaptureInfo = await snapshot.getLoadable(
      currentCaptureInfoState
    ).contents;
    const image = await fetch(currentCaptureInfo.url);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = `${currentCaptureInfo.group}-${currentCaptureInfo.cid}.png`;
    link.click();
  });

  const deleteImage = useRecoilCallback(
    ({ set, reset, snapshot }) =>
      async () => {
        if (!window.confirm('Are you sure you want to delete this?')) return;
        const path = await snapshot.getLoadable(pathState).contents;
        const currentUserID = await snapshot.getLoadable(currentUserIDState)
          .contents;
        const captureList = await snapshot.getLoadable(captureListState)
          .contents;
        const currentCaptureInfo = await snapshot.getLoadable(
          currentCaptureInfoState
        ).contents;

        const captureListAtHost = await snapshot.getLoadable(
          captureListAtHostState
        ).contents;

        storage.remove(
          `${currentUserID}/${currentCaptureInfo.group}/${currentCaptureInfo.cid}`
        );
        await firebase.deleteCapture(currentUserID, path.cid);
        reset(currentCaptureInfoState);
        reset(currentCaptureInfoIndexState);
        const cloneCaptureList = [...captureList];
        _(cloneCaptureList)
          .remove(({ cid }) => cid === path.cid)
          .value();

        set(captureListState, cloneCaptureList);

        const list = _.remove(
          [...captureListAtHost],
          ({ cid }) => cid !== path.cid
        );

        const nextCid =
          Array.isArray(list) && list.length > 0 ? list[0].cid : null;

        if (!nextCid || nextCid === path.cid) {
          navigate('/', { replace: true });
        } else {
          navigate(`/${path.uid}/${nextCid}`);
        }
      }
  );

  const replaceImage = useRecoilCallback(
    ({ set, reset, snapshot }) =>
      async (file: Blob, progress: Function, cb: Function) => {
        const currentUserID = await snapshot.getLoadable(currentUserIDState)
          .contents;
        const currentCaptureInfo = await snapshot.getLoadable(
          currentCaptureInfoState
        ).contents;
        const path = `${currentUserID}/${currentCaptureInfo.group}/${currentCaptureInfo.cid}`;

        storage.replace(
          currentUserID,
          currentCaptureInfo.cid,
          file,
          path,
          progress,
          cb
        );
      }
  );

  return {
    copyLinkToClipboard,
    copyToClipboard,
    downloadImage,
    deleteImage,
    replaceImage,
    copyGroupLinkToClipboard,
  };
};
