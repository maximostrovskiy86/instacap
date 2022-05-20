import { useRecoilValue } from 'recoil';
import {
  getUser,
  sendPostForReply,
  sendPostForComment,
} from '@/lib/firebase/firestore';
import { newCommentUidsState, newReplyUidsState } from '@/state/userState';
import type { UserInfo } from 'firebase/auth';
import asyncPool from 'tiny-async-pool';

const APP_ID = 'uw7s2sjp';

export const useIntercom = () => {
  const newCommentUids = useRecoilValue(newCommentUidsState);
  const newReplyUids = useRecoilValue(newReplyUidsState);
  const init = () => {
    try {
      // Set your APP_ID
      // @ts-ignore
      window.intercomSettings = {
        app_id: APP_ID,
      };
      var w = window;
      // @ts-ignore
      var ic = w.Intercom;
      if (typeof ic === 'function') {
        ic('reattach_activator');
        // @ts-ignore
        ic('update', w.intercomSettings);
      } else {
        var d = document;
        var i = function () {
          // @ts-ignore
          i.c(arguments);
        };
        // @ts-ignore
        i.q = [];
        // @ts-ignore
        i.c = function (args) {
          // @ts-ignore
          i.q.push(args);
        };
        // @ts-ignore
        w.Intercom = i;
        var l = function () {
          var s = d.createElement('script');
          s.type = 'text/javascript';
          s.async = true;
          s.src = 'https://widget.intercom.io/widget/' + APP_ID;
          var x = d.getElementsByTagName('script')[0];
          // @ts-ignore
          x.parentNode.insertBefore(s, x);
        };
        if (document.readyState === 'complete') {
          l();
          // @ts-ignore
        } else if (w.attachEvent) {
          // @ts-ignore
          w.attachEvent('onload', l);
        } else {
          w.addEventListener('load', l, false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setting = (obj: object) => {
    const { displayName, uid, email } = obj as UserInfo;
    if (!email) return false;
    // @ts-ignore
    window.Intercom('boot', {
      app_id: APP_ID,
      user_id: uid,
      email,
      name: displayName,
    });
  };

  const newComment = async () => {
    if (newCommentUids && typeof newCommentUids === 'object') {
      const captureCreatorInfo = await getUser(
        newCommentUids.captureCreatorUid
      );
      const userInfo = await getUser(newCommentUids.userUid);
      if (
        typeof captureCreatorInfo === 'object' &&
        typeof userInfo === 'object'
      ) {
        // console.log('send new comment');
        const captureCreatorEmail = captureCreatorInfo.email || '';
        const captureCreatorName = captureCreatorInfo.displayName || '';
        const userEmail = userInfo.email || '';
        const userName = userInfo.displayName || '';
        sendPostForComment(
          {
            email: captureCreatorEmail,
            name: captureCreatorName,
          },
          {
            email: userEmail,
            name: userName,
          }
        );
      }
    }
  };

  const newReply = async () => {
    if (!newReplyUids || typeof newReplyUids !== 'object') return false;
    const userInfo = await getUser(newReplyUids.userUid);
    const replyersInfos = await asyncPool(3, newReplyUids.replyerUids, getUser);
    if (!Array.isArray(replyersInfos) || replyersInfos.length < 1) return false;
    replyersInfos.forEach((commentCreatorInfo) => {
      if (
        typeof commentCreatorInfo === 'object' &&
        typeof userInfo === 'object'
      ) {
        // console.log('send new replay');
        const commentCreatorEmail = commentCreatorInfo.email || '';
        const commentCreatorName = commentCreatorInfo.displayName || '';
        const userEmail = userInfo.email || '';
        const userName = userInfo.displayName || '';
        sendPostForReply(
          {
            email: commentCreatorEmail,
            name: commentCreatorName,
          },
          {
            email: userEmail,
            name: userName,
          }
        );
      }
    });
  };

  return {
    init,
    setting,
    newComment,
    newReply,
  };
};
