import { Link, NavLink, useNavigate } from 'react-router-dom';
import { cx } from '../../styles';
import styles from './header.module.scss';
import logo from '../../assets/coinmoa.png';
import { useRecoilState } from 'recoil';
import { isLoginState } from '../../recoil/recoil';
import { useEffect } from 'react';

const Header = () => {
  const uniqueId = localStorage.getItem('id');
  const userLoginId = localStorage.getItem('userId');

  const [isLogin, setIsLogin] = useRecoilState(isLoginState);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('id');
    setIsLogin(false);
    navigate('/');
  };

  useEffect(() => {
    if (uniqueId !== null && userLoginId !== null) {
      setIsLogin(true);
    }
  }, [uniqueId, isLogin, setIsLogin, userLoginId]);

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Link to='/' className={styles.logo}>
          <img src={logo} alt='logo' />
          <h1>COINMOA</h1>
        </Link>
        <nav className={styles.nav}>
          <NavLink to='/' className={({ isActive }) => cx({ [styles.isActive]: isActive })}>
            암호화폐
          </NavLink>

          <NavLink to='exchange' className={({ isActive }) => cx({ [styles.isActive]: isActive })}>
            거래소
          </NavLink>

          <NavLink to='portFolio' className={({ isActive }) => cx({ [styles.isActive]: isActive })}>
            포트폴리오
          </NavLink>
        </nav>
        <div className={styles.sign}>
          {isLogin ? (
            <>
              <p>{`${userLoginId}님 환영합니다`}</p>
              <button type='button' className={styles.logout} onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <>
              <NavLink to='signUp'>회원가입</NavLink>
              <NavLink to='signIn'>로그인</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
