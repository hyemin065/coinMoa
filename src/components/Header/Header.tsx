import { NavLink } from 'react-router-dom';
import { cx } from '../../styles';
import styles from './header.module.scss';
import logo from '../../assets/coinmoa.png';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <div className={styles.logo}>
          <img src={logo} alt='logo' />
          <h1>COINMOA</h1>
        </div>
        <nav className={styles.nav}>
          <NavLink to='/' className={({ isActive }) => cx({ [styles.isActive]: isActive })}>
            암호화폐
          </NavLink>

          <NavLink to='portFolio' className={({ isActive }) => cx({ [styles.isActive]: isActive })}>
            포트폴리오
          </NavLink>
        </nav>
        <div className={styles.sign}>
          <NavLink to='signUp'>회원가입</NavLink>
          <NavLink to='signIn'>로그인</NavLink>
        </div>
      </div>
    </header>
  );
};

export default Header;
