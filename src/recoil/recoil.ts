import { IUserCoinUpdate } from '../types/coin';
import { atom } from 'recoil';

export const modalState = atom<boolean>({
  key: 'modalState',
  default: false,
});

export const isLoginState = atom<boolean>({
  key: 'isLoginState',
  default: false,
});

export const dateState = atom<string>({
  key: 'dateState',
  default: '',
});

export const coinUpdateState = atom<IUserCoinUpdate[]>({
  key: 'coinUpdateState',
  default: [],
});
