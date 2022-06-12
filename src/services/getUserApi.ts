import { IUser } from '../types/user';
import axios from 'axios';

export const signUpApi = async (params: IUser) => {
  try {
    await axios.post('https://coin-moa.herokuapp.com/users/signup', {
      userId: params.userId,
      userPassword: params.userPassword,
    });
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const signInApi = async (params: IUser) => {
  try {
    const res = await axios.post('https://coin-moa.herokuapp.com/users/signin', {
      userId: params.userId,
      userPassword: params.userPassword,
    });

    const { data } = res;
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const userCheckIdApi = async (id: string) => {
  try {
    const res = await axios.post('https://coin-moa.herokuapp.com/users/ischeckId', {
      userId: id,
    });
    const { data } = res;
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
