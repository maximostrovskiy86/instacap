// import dayjs from 'dayjs';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';

const DB_PREFIX = 'instacap/email/post';

type UserInfoForPost = {
  email: string;
  name: string;
};

export const sendPostForComment = async (
  receiver: UserInfoForPost,
  sender: UserInfoForPost
) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, DB_PREFIX);
    const docRef = doc(colRef, nanoid());
    await setDoc(docRef, {
      to: [receiver.email],
      message: {
        // prettier-ignore
        subject: `💬 New comment on your capture`,
        // prettier-ignore
        html: `A new comment from ${sender.email || sender.name} was just added to your capture:<br /><br /><a href='${window.location.href}'>View Comment</a>`,
      },
    });
  } catch (error) {
    console.error('Error set post: ', error);
  }
};

export const sendPostForReply = async (
  receiver: UserInfoForPost,
  sender: UserInfoForPost
) => {
  try {
    const db = getFirestore();
    const colRef = collection(db, DB_PREFIX);
    const docRef = doc(colRef, nanoid());
    await setDoc(docRef, {
      to: [receiver.email],
      message: {
        // prettier-ignore
        subject: `💬 New reply to your comment`,
        // prettier-ignore
        html: `A new reply from ${sender.email || sender.name} was just added to your comment:<br /><br /><a href='${window.location.href}'>View Reply</a>`,
      },
    });
  } catch (error) {
    console.error('Error set post: ', error);
  }
};
