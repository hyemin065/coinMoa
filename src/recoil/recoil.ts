import { atom } from 'recoil';

export const modalState = atom<boolean>({
  key: 'modalState',
  default: false,
});

export const dropDownState = atom<string>({
  key: 'dropDownState',
  default: '업비트',
});
