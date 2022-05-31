import { atom } from 'recoil';

export const modalState = atom<boolean>({
  key: 'modalState',
  default: false,
});

export const isLoginState = atom<boolean>({
  key: 'isLoginState',
  default: false,
});
