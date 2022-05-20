import dayjs from 'dayjs';
import {
  getFirestore,
  collection,
  onSnapshot,
  getDoc,
  doc,
  updateDoc,
  increment,
  setDoc,
  DocumentReference,
} from 'firebase/firestore';

export const getAnonymousPopulation = async () => {
  const db = getFirestore();
  const docRef = doc(db, 'instacap/anonymous') as DocumentReference<{
    population: number;
  }>;
  try {
    await updateDoc(docRef, {
      population: increment(1),
    });
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().population;
    }
  } catch (error) {
    const docRef = doc(db, 'instacap/anonymous');
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      await setDoc(docRef, { population: 1 });
    }
    return 1;
  }
};

export const setUser = async (uid: string, info: object) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, 'instacap', 'users', 'uids');
    await setDoc(doc(colRef, uid), { createdAt: dayjs().unix(), ...info });
  } catch (error) {
    console.error('Error set user: ', error);
  }
};

export const getUser = async (uid: string) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, 'instacap', 'users', 'uids');
    const docSnap = await getDoc(doc(colRef, uid));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return false;
  } catch (error) {
    console.error('Error get user: ', error);
  }
};

export const getUserSub = (uid: string, cb: Function) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, 'instacap', 'users', 'uids');
    const unsub = onSnapshot(
      doc(colRef, uid),
      (doc) => {
        cb({ ...doc.data(), uid });
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
    console.log('Error get creator info: ', error);
  }
};

export const updateUser = async (uid: string, info: object) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, 'instacap', 'users', 'uids');
    await updateDoc(doc(colRef, uid), { updatedAt: dayjs().unix(), ...info });
  } catch (error) {
    console.error('Error update user: ', error);
  }
};
