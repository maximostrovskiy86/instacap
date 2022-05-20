import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
  GoogleAuthProvider,
  linkWithPopup,
  signInWithCredential,
  OAuthProvider,
} from 'firebase/auth';
import { firebaseConfig } from './config';
import { getAnonymousPopulation, setUser, updateUser } from './firestore';
import {
  isExtensionAnonymous,
  withExtension,
  extensionSignOut,
  extensionSignIn,
} from '../chromeExtension';
import type { UserInfo } from 'firebase/auth';

initializeApp(firebaseConfig);

let fromClickingSignIn = false;

let hasAuth = false;

export const getUser = () => {
  return getAuth().currentUser;
};

export const init = (
  userCb: Function,
  notUserCb: Function,
  setLinkModal: Function,
  authProblemCb: Function
) => {
  console.log('firebase init');
  const auth = getAuth();
  setPersistence(auth, browserLocalPersistence);
  const unsub = onAuthStateChanged(
    auth,
    async (user) => {
      try {
        if (user) {
          hasAuth = true;
          const uid = user.uid;
          console.log(uid);
          console.log('is Anonymous', user.isAnonymous, isExtensionAnonymous);
          // console.log(isExtensionAnonymous);
          // console.log(user.isAnonymous);
          if (
            !fromClickingSignIn &&
            !user.isAnonymous &&
            withExtension &&
            isExtensionAnonymous
          ) {
            setLinkModal();
          }
          if (!user.displayName) {
            const result = await getAnonymousPopulation();
            const displayName = `Guest-${result}`;
            await updateProfile(user, {
              displayName,
            });
            setUser(uid, { displayName });
          }

          userCb(user);
        } else {
          console.log('anonymous auth start by web');
          if (hasAuth) {
            console.log('woops!!!');
            authProblemCb();
            return false;
          }
          signInAnonymously(auth)
            .then(() => {
              // Signed in..
            })
            .catch((error) => {
              // const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorMessage);
              // ...
            });
          // // notUserCb();
        }
      } catch (error) {
        console.log(error);
      } finally {
        fromClickingSignIn = false;
      }
    },
    (err) => {
      console.log('Error auth: ', err);
    }
  );
  return unsub;
};

export const linkToGoogle = async (defaultCb: Function, linkCb: Function) => {
  fromClickingSignIn = true;
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const { currentUser } = auth;

  if (!currentUser) return;

  try {
    if (currentUser) {
      const userCredential = await linkWithPopup(currentUser, provider);
      if (currentUser.providerData[0].displayName) {
        await updateProfile(currentUser, {
          displayName: currentUser.providerData[0].displayName,
        });
        const userInfo = currentUser.toJSON() as UserInfo;

        const displayName = userInfo.displayName || '';
        const email = userInfo.email || '';
        const phoneNumber = userInfo.phoneNumber || '';
        const photoURL = userInfo.photoURL || '';

        updateUser(currentUser.uid, {
          displayName,
          email,
          phoneNumber,
          photoURL,
        });
      }
      linkCb(currentUser);
      if (withExtension) {
        extensionSignIn(
          OAuthProvider.credentialFromResult(userCredential)?.toJSON()
        );
      }
    }
  } catch (error: any) {
    const credential = OAuthProvider.credentialFromError(error);
    if (credential) {
      signInWithCredential(auth, credential);
      if (withExtension) {
        extensionSignIn(credential.toJSON());
      }
    }
  } finally {
    defaultCb();
  }
};

export const signOut = async (cb: Function) => {
  try {
    hasAuth = false;
    if (withExtension) {
      extensionSignOut();
    }

    const auth = getAuth();
    await auth.signOut();
    cb();
  } catch (error) {
    console.log(error);
  }
};
