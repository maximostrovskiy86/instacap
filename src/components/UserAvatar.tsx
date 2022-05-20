import { useAuth } from '@/hooks/useAuth';
import { User } from 'firebase/auth';
import { FC, useEffect, useState } from 'react';

const colors = [
  'FF38A4',
  'B0FF62',
  '54FFEA',
  '000000',
  '9B51E0',
  'FF5B37',
  'FFF8F4',
];
const variant = 'beam';
const host = 'https://source.boringavatars.com';
const size = '36';

const cacheAvatar: { [key: string]: string } = {};

const UserAvatar: FC<{ uid: string }> = ({ uid }) => {
  const [url, setUrl] = useState(
    `${host}/${variant}/${size}/${uid}?colors=${colors.join(',')}`
  );
  const { getUserInfo, getStoredUserInfo } = useAuth();
  const user = getUserInfo() as User;

  useEffect(() => {
    if (user.uid === uid && user?.providerData) {
      user.providerData.forEach((profile) => {
        if (profile.photoURL) {
          setUrl(profile.photoURL);
        }
      });
    }
  }, [user, uid]);

  useEffect(() => {
    const fetch = async () => {
      const otherInfo = await getStoredUserInfo(uid);
      if (otherInfo?.avatar) {
        cacheAvatar[uid] = otherInfo.avatar;
        setUrl(otherInfo.avatar);
      }
    };
    if (user.uid !== uid) {
      if (cacheAvatar[uid]) {
        setUrl(cacheAvatar[uid]);
      } else {
        fetch();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, uid]);

  return <img src={url} width={36} alt="avatar" />;
};

export default UserAvatar;
