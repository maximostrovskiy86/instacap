import { atom } from 'recoil';

export const appState = atom<boolean>({
  key: 'IsReady',
  default: false,
});

export const pathState = atom({
  key: 'Path',
  default: { uid: '', cid: '', gid: '' },
});

export const hasAuthProblemState = atom<boolean>({
  key: 'HasAuthProblem',
  default: false,
});

export const isCheckExtensionState = atom<boolean>({
  key: 'IsCheckExtension',
  default: false,
});
