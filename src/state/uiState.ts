import { atom } from 'recoil';

export const sidebarState = atom({
  key: 'Sidebar',
  default: false,
});

export const syncWithExtensionState = atom({
  key: 'SyncWithExtension',
  default: false,
});

export const captureBoardScrollYState = atom({
  key: 'CaptureBoardScrollY',
  default: 0,
});
