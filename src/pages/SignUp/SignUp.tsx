import { ChangeEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { signUpApi, userCheckIdApi } from '../../services/getUserApi';
import SignInput from '../../components/SignInput/SignInput';

import styles from './signUp.module.scss';

const SignUp = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [idCheckMsg, setIdCheckMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');
  const [passwordConfirmErrorMsg, setPasswordConfirmErrorMsg] = useState('');
  const [idDuplicateCheck, setIdDuplicateCheck] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const isIdColor = idCheckMsg.includes('사용가능') ? `${styles.success}` : `${styles.error}`;

  const handleChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setId(value);
    setIdCheckMsg('');
    setIdDuplicateCheck(false);
  };

  const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setPassword(value);
    setPasswordErrorMsg('');
  };

  const handleChangePasswordConfirm = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setPasswordConfirm(value);

    setPasswordConfirmErrorMsg('');
  };

  const handleisCheckId = async () => {
    if (id !== '') {
      const data = await userCheckIdApi(id);

      if (data.success) {
        setIdCheckMsg('사용가능한 아이디입니다.');
        setIdDuplicateCheck(true);
      } else {
        setIdCheckMsg(data.message);
        setIdDuplicateCheck(false);
      }
    } else {
      setIdCheckMsg('아이디를 입력해주세요');
      setIdDuplicateCheck(false);
    }
  };

  const signUp = async () => {
    setPasswordConfirmErrorMsg('');

    if (!idDuplicateCheck) {
      setIdCheckMsg('아이디를 확인 해주세요.');
    }

    if (id === '') {
      setIdCheckMsg('아이디를 입력해주세요.');
    }

    if (password.length < 8) {
      setPasswordErrorMsg('비밀번호가 8자리 이하입니다');
      return;
    }

    if (passwordConfirm !== password) {
      setPasswordConfirmErrorMsg('비밀번호가 다릅니다');
      return;
    }

    if (idDuplicateCheck && password.length >= 8 && passwordConfirm === password) {
      await signUpApi({
        userId: id,
        userPassword: password,
      });
      setId('');
      setPassword('');
      setPasswordConfirm('');
      setSignUpSuccess(true);
    }
  };

  return (
    <section className={styles.signUpWrapper}>
      {signUpSuccess ? (
        <div className={styles.signUpSuccessWrap}>
          <p> 회원가입이 완료되었습니다</p>
          <Link to='/signin'>로그인</Link>
        </div>
      ) : (
        <>
          <h2>회원 가입</h2>
          <p>
            이미 아이디가 있으신가요? <Link to='/signin'>로그인</Link>
          </p>
          <div className={styles.formGroup}>
            <SignInput label='아이디' type='text' id='id' onChange={handleChangeId} check onClick={handleisCheckId} />
            <p className={isIdColor}>{idCheckMsg}</p>
          </div>

          <div className={styles.formGroup}>
            <SignInput label='비밀번호' type='password' id='password' onChange={handleChangePassword} check={false} />
            <p className={styles.error}>{passwordErrorMsg}</p>
          </div>

          <div className={styles.formGroup}>
            <SignInput
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
        </>
      )}
    </section>
  );
};

export default SignUp;
