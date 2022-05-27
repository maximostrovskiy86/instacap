import { useRecoilCallback } from 'recoil';
import dayjs from 'dayjs';
import { pathState } from '@/state/appState';
import {setCaptureInvite} from "@/lib/firebase/firestore/capture";
import {sendPostForInvite} from "@/lib/firebase/firestore/email";
import {getUser} from "@/lib/firebase/firestore";

export const useInvitation = () => {
  const setInvitation = useRecoilCallback(
    ({ snapshot }) =>
    async (emails: string[]) => {
      try {
        const path = await snapshot.getLoadable(pathState).contents;
        const user = await getUser(path.uid) as Capture.Creator;

        if (user?.displayName && user?.email) {
          const { displayName, email } = user;
          const creator = {
            name: displayName,
            email,
            uid: path.uid
          };

          const now = dayjs().unix();
          // @ts-ignore
          const invitation: Capture.Invitation = {
            emails,
            creator,
            createdAt: now,
          };
          // @ts-ignore
          const data: Capture.InvitationData = {
            invitation,
            updatedAt: now,
          };
          sendPostForInvite(emails, { name: displayName, email });
          return await setCaptureInvite(path.uid, path.cid, data);
        }
      } catch (err) {
        console.error('Sending the board invitetion error:', err);
      }
    }
  );

  return {
    setInvitation,
  }
}
