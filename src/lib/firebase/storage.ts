import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage';
import { nanoid } from 'nanoid';
import dayjs from 'dayjs';
import { getUser } from './auth';
import { saveCapture, updateCapture } from './firestore';

export const saveFile = async (
  blob: Blob,
  progressCb: Function,
  resultCb: Function,
  group: string,
  addData: object = {}
) => {
  try {
    const storage = getStorage();

    const { uid = '', displayName, email } = getUser() || {};
    const cid = nanoid();
    const now = dayjs().unix();

    const usersCollection = ref(storage, `captures/${uid}/${group}/${cid}`);
    const uploadTask = uploadBytesResumable(usersCollection, blob, {
      cacheControl: `public, max-age=${365 * 24 * 60 * 60 * 1000}`,
    });

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // const progress =
        //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        progressCb(true, snapshot.bytesTransferred, snapshot.totalBytes);
      },
      (err) => {
        console.log(err);
      },
      async () => {
        const url = await getDownloadURL(usersCollection);
        await saveCapture(uid, cid, {
          cid,
          url,
          group,
          capturedUrl: `upload/${uid}/${cid}`,
          port: '',
          createdAt: now,
          creator: {
            uid,
            displayName,
            email,
          },
          view: {
            count: 0,
            viewer: [],
          },
          isDone: true,
          ...addData,
        });
        resultCb(`${uid}/${cid}`);
      }
    );
  } catch (error) {
    console.log(error);
  }
};

export const getFile = async (url: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, url);
  await getDownloadURL(storageRef);
};

export const remove = async (path: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, `captures/${path}`);
  await deleteObject(storageRef);
};

export const replace = async (
  uid: string,
  cid: string,
  blob: Blob,
  path: string,
  progressCb: Function,
  cb: Function
) => {
  const storage = getStorage();
  const usersCollection = ref(storage, `captures/${path}`);
  const uploadTask = uploadBytesResumable(usersCollection, blob);
  uploadTask.on(
    'state_changed',
    (snapshot) => {
      // const progress =
      //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      progressCb(true, snapshot.bytesTransferred, snapshot.totalBytes);
    },
    (err) => {
      console.log(err);
    },
    async () => {
      const url = await getDownloadURL(usersCollection);

      await updateCapture(uid, cid, {
        url,
      });
      cb();
    }
  );
};
