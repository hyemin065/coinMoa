import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Input/Input';
import styles from './signIn.module.scss';

const SignIn = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [idCheckMsg, setIdCheckMsg] = useState('');

  const navigate = useNavigate();

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

  const signIn = async () => {
    try {
      await axios.post('http://localhost:5000/users/signin', {
        userId: id,
        userPassword: password,
      });
      setId('');
      setPassword('');
      console.log('로그인 성공');
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className={styles.signInWrapper}>
      <h2>로그인</h2>
      <p>
        회원이 아니신가요? <Link to='/signup'>회원가입</Link>
      </p>
      <div className={styles.formGroup}>
        <Input label='아이디' type='text' id='id' onChange={handleChangeId} check={false} />

        <p />
      </div>

      <div className={styles.formGroup}>
        <Input label='비밀번호' type='password' id='password' onChange={handleChangePassword} check={false} />
        <p />
      </div>

      <button type='button' className={styles.signBtn} onClick={signIn}>
        로그인
      </button>
    </section>
  );
};

export default SignIn;
