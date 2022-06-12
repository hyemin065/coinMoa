import { ChangeEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { isLoginState } from '../../recoil/recoil';
import axios from 'axios';

import SignInput from '../../components/SignInput/SignInput';

import styles from './signIn.module.scss';
import { signInApi } from '../../services/getUserApi';

const SignIn = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [idErrorMsg, setIdErrorMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [loginFail, setloginFail] = useState('');

  const isSetLogin = useSetRecoilState(isLoginState);

  const navigate = useNavigate();

  const handleChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setId(value);
    setloginFail('');
    setIdErrorMsg('');
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setPassword(value);
    setloginFail('');
    setPasswordErrorMsg('');
  };

  const signIn = async () => {
    if (id === '') {
      setIdErrorMsg('아이디를 입력해주세요');
    }

    if (password === '') {
      setPasswordErrorMsg('비밀번호를 입력해주세요');
    }

    if (id !== '' && password !== '') {
      const data = await signInApi({
        userId: id,
        userPassword: password,
      });
      const { _id: uniqueId } = data.user[0];
      if (data.success) {
        navigate('/');
        localStorage.setItem('userId', data.user[0].userId);
        localStorage.setItem('id', uniqueId);
        isSetLogin(true);
      } else {
        setloginFail('로그인 실패');
      }
    }
  };

  return (
    <section className={styles.signInWrapper}>
      <h2>로그인</h2>
      <p>
        회원이 아니신가요? <Link to='/signup'>회원가입</Link>
      </p>

      <div className={styles.formGroup}>
        <SignInput label='아이디' type='text' id='id' onChange={handleChangeId} check={false} />
        <p className={styles.error}>{idErrorMsg}</p>
      </div>

      <div className={styles.formGroup}>
        <SignInput label='비밀번호' type='password' id='password' onChange={handleChangePassword} check={false} />
        <p className={styles.error}>{passwordErrorMsg}</p>
      </div>

      <p className={styles.error}>{loginFail}</p>

      <button type='button' className={styles.signBtn} onClick={signIn}>
        로그인
      </button>
    </section>
  );
};

export default SignIn;
