import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import styles from './signUp.module.scss';

const SignUp = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [idCheckMsg, setIdCheckMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [passwordConfirmErrorMsg, setPasswordConfirmErrorMsg] = useState('');

  const navigate = useNavigate();

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
    if (id === '') {
      setIdCheckMsg('아이디를 입력해주세요.');
    }
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
      navigate('/signup/signupcompleted');
      setId('');
      setPassword('');
      setPasswordConfirm('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={styles.signUpWrapper}>
      <h2>회원 가입</h2>
      <p>
        이미 아이디가 있으신가요? <Link to='/signin'>로그인</Link>
      </p>

      <div className={styles.formGroup}>
        <Input label='아이디' type='text' id='id' onChange={handleChangeId} check onClick={handleisCheckId} />
        <p className={isIdColor}>{idCheckMsg}</p>
      </div>

      <div className={styles.formGroup}>
        <Input label='비밀번호' type='password' id='password' onChange={handleChangePassword} check={false} />
        <p className={styles.error}>{passwordErrorMsg}</p>
      </div>

      <div className={styles.formGroup}>
        <Input
          label='비밀번호확인'
          type='password'
          id='passwordConfirm'
          onChange={handleChangePasswordConfirm}
          check={false}
        />
        <p className={styles.error}>{passwordConfirmErrorMsg}</p>
      </div>

      <button type='button' onClick={signUp} className={styles.signBtn}>
        회원가입
      </button>
    </section>
  );
};

export default SignUp;
