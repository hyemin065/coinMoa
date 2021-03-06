import { TopArrowIcon } from '../../assets';

import styles from './scrollTopButton.module.scss';

const ScrollTopButton = () => {
  const handleScrollTop = () => {
    if (!window.scrollY) return;

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button type='button' onClick={handleScrollTop} className={styles.topButton}>
      <TopArrowIcon />
    </button>
  );
};

export default ScrollTopButton;
