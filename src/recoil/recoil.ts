import { IUserCoinList } from '../types/coin';
import { atom } from 'recoil';

export const modalState = atom<boolean>({
  key: 'modalState',
  default: false,
});

export const isLoginState = atom<boolean>({
  key: 'isLoginState',
  default: false,
});

export const loginIdState = atom<string>({
  key: 'loginIdState',
  default: '',
});

export const dateState = atom<string>({
  key: 'dateState',
  default: '',
});

export const coinListState = atom<IUserCoinList[]>({
  key: 'coinListState',
  default: [],
});
