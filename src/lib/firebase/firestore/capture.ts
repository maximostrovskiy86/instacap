import dayjs from 'dayjs';
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  orderBy,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';

const DB_PREFIX = 'instacap/captures';
const DB_INVITE_PREFIX = 'instacap/invite';

export const saveCapture = async (uid: string, cid: string, data: any) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, 'instacap', 'captures', uid);
    const docRef = doc(colRef, cid);
    await setDoc(docRef, data);
    return () => {
      deleteDoc(docRef);
    };
  } catch (error) {
    console.error('Error adding document: ', error);
  }
};

export const updateCapture = async (uid: string, cid: string, info: object) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, 'instacap', 'captures', uid);
    await updateDoc(doc(colRef, cid), { updatedAt: dayjs().unix(), ...info });
  } catch (error) {
    console.error('Error update user: ', error);
  }
};

export const getList = async (uid: string, cb: Function) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, `${DB_PREFIX}/${uid}`);

    const q = query(colRef, orderBy('createdAt', 'desc'));

    const colSnap = await getDocs(q);

    const result: Capture.Info[] = [];

    colSnap.forEach((docSnap) => {
      if (docSnap.exists()) {
        result.push(docSnap.data() as Capture.Info);
      }
    });

    cb(result);
  } catch (error) {
    console.log(error);
  }
};

export const getSub = (uid: string, cb: Function) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, `${DB_PREFIX}/${uid}`);

    const q = query(colRef, where('createdAt', '>', dayjs().unix()));

    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(change.type);
        if (change.type === 'added') {
          cb(change.doc.data());
        }
      });
    });

    return () => {
      unsub();
    };
  } catch (error) {
    console.log(error);
    return () => {};
  }
};

export const setGId = async (uid: string, group: string) => {
  const db = getFirestore();
  const colRef = collection(db, 'instacap', 'publicCaptures', uid);
  // find gid
  const q = query(colRef, where('group', '==', group));
  const colSnap = await getDocs(q);
  if (colSnap.size > 0 && colSnap.docs[0].exists()) {
    return colSnap.docs[0].id;
  }
  // create gid
  const gid = nanoid();
  const docRef = doc(db, 'instacap', 'publicCaptures', uid, gid);
  await setDoc(docRef, { group });
  return gid;
};

export const getGroupByGId = async (
  uid: string,
  gid: string,
  successCb: Function,
  failCb: Function
) => {
  const db = getFirestore();
  const docRef = doc(db, 'instacap', 'publicCaptures', uid, gid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const { group } = docSnap.data() as { group: string };
    successCb(uid, group);
  } else {
    failCb();
  }
};

export const getListByGroup = async (
  uid: string,
  group: string,
  cb: Function
) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, `${DB_PREFIX}/${uid}`);

    const q = query(colRef, where('group', '==', group));

    const colSnap = await getDocs(q);

    const result: Capture.Info[] = [];

    colSnap.forEach((docSnap) => {
      if (docSnap.exists()) {
        result.push(docSnap.data() as Capture.Info);
      }
    });

    cb(result);
  } catch (error) {
    console.log(error);
  }
};

export const getListByGroupSub = (uid: string, group: string, cb: Function) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, `${DB_PREFIX}/${uid}`);

    const q = query(colRef, where('group', '==', group));

    const unsub = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        cb(change.type, change.doc.data());
      });
    });

    return () => {
      unsub();
    };
  } catch (error) {
    console.log(error);
    return () => {};
  }
};

export const getPublicOne = async (uid: string, cid: string, cb: Function) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, `${DB_PREFIX}/${uid}/${cid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      cb(docSnap.data() as Capture.Info);
    } else {
      cb(null);
    }
  } catch (error) {
    console.log(error);
  }
};

export const getCaptureInfoSub = (uid: string, cid: string, cb: Function) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, `${DB_PREFIX}/${uid}/${cid}`);

    const unsub = onSnapshot(
      docRef,
      (doc) => {
        cb(doc.data());
      },
      (err) => {
        console.log(err);
      }
    );

    return () => {
      // console.log('here');
      unsub();
    };
  } catch (error) {
    console.log(error);
    return () => {};
  }
};

export const setCaptureComment = async (
  uid: string,
  cid: string,
  comment: Capture.Comment
) => {
  const db = getFirestore();
  const docRef = doc(db, `${DB_PREFIX}/${uid}/${cid}`);

  await updateDoc(docRef, {
    comments: arrayUnion(comment),
  });
};

export const setCaptureCommentReply = async (
  uid: string,
  cid: string,
  comments: Capture.Comment[]
) => {
  const db = getFirestore();
  const docRef = doc(db, `${DB_PREFIX}/${uid}/${cid}`);
  await updateDoc(docRef, {
    comments,
  });
};

export const deleteCapture = async (uid: string, cid: string) => {
  const db = getFirestore();
  const docRef = doc(db, `${DB_PREFIX}/${uid}/${cid}`);
  await deleteDoc(docRef);
};

export const setCaptureInvite = async (
  uid: string,
  cid: string,
  data: Capture.InvitationData
) => {
  // @ts-ignore
  const { updatedAt, invitation } = data;

  try {
    const db = getFirestore();
    const docRef = doc(db, `${DB_INVITE_PREFIX}/${uid}/${cid}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        updatedAt,
        invitations: arrayUnion(invitation),
      });
    } else {
      await setDoc(docRef, {
        updatedAt,
        invitations: [invitation],
      });
    }
    return { message: 'Invitations added to the database successfully' };
  } catch (err) {
    console.error('Setting capture invitetion error:', err);
  }
};

export const addViewer = async (
  uid: string,
  cid: string,
  currentUserID: string,
  noDataCb: Function
) => {
  try {
    const db = getFirestore();
    const docRef = doc(db, `${DB_PREFIX}/${uid}/${cid}`);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data() as Capture.Info;
      if (!data.view.viewer.includes(currentUserID)) {
        console.log(currentUserID);
        const viewer = [...data.view.viewer, currentUserID];
        await updateDoc(docRef, {
          view: {
            count: viewer.length,
            viewer,
          },
        });
      }
    } else {
      noDataCb();
    }
  } catch (error) {
    console.log(error);
  }
};
