import axios from 'axios';
import { useState } from 'react';
import styles from './signUp.module.scss';

const SignUp = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [idCheckMsg, setIdCheckMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [passwordConfirmErrorMsg, setPasswordConfirmErrorMsg] = useState('');

  const isIdColor = idCheckMsg.includes('중복') ? `${styles.error}` : `${styles.success}`;

  const handleChangeId = (e: any) => {
    const { value } = e.currentTarget;
    setId(value);

    if (value === '') {
      setIdCheckMsg('');
    }
  };

  const handleChangePassword = (e: any) => {
    const { value } = e.currentTarget;
    setPassword(value);
  };

  const handleChangePasswordConfirm = (e: any) => {
    const { value } = e.currentTarget;
    setPasswordConfirm(value);
  };

  const handleisCheckId = async () => {
    if (id !== '') {
      try {
        const res = await axios.post('http://localhost:5000/users/ischeckId', {
          userId: id,
        });
        const { data } = res;
        if (data.success) {
          setIdCheckMsg('사용가능한 아이디입니다.');
        }
      } catch (error) {
        setIdCheckMsg('중복된 아이디가 있습니다');
      }
    }
  };

  const signUp = async () => {
    if (password.length < 8) {
      setPasswordErrorMsg('비밀번호가 8자리 이하입니다');
      return;
    }
    setPasswordErrorMsg('');

    if (passwordConfirm !== password) {
      setPasswordConfirmErrorMsg('비밀번호가 다릅니다');
      return;
    }
    setPasswordConfirmErrorMsg('');

    try {
      await axios.post('http://localhost:5000/users/signup', {
        userId: id,
        userPassword: password,
      });
      console.log('회원가입 완료');
      setId('');
      setPassword('');
      setPasswordConfirm('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={styles.signUpWrapper}>
      <div>
        <label htmlFor='id'>아이디</label>
        <input type='text' id='id' value={id} onChange={handleChangeId} />
        <button type='button' onClick={handleisCheckId}>
          중복확인
        </button>
        <p className={isIdColor}>{idCheckMsg}</p>
      </div>

      <div>
        <label htmlFor='password'>비밀번호</label>
        <input type='password' id='password' value={password} onChange={handleChangePassword} />
        <span>{passwordErrorMsg}</span>
      </div>

      <div>
        <label htmlFor='passwordConfirm'>비밀번호확인</label>
        <input type='password' id='passwordConfirm' value={passwordConfirm} onChange={handleChangePasswordConfirm} />
        <span>{passwordConfirmErrorMsg}</span>
      </div>

      <button type='button' onClick={signUp} className={styles.signUpBtn}>
        회원가입
      </button>
    </section>
  );
};

export default SignUp;
