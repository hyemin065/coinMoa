import { useRecoilState } from 'recoil';
import { currencyState } from '../../recoil/recoil';

import styles from './toggleButton.module.scss';

const ToggleButton = () => {
  const [iscurrency, SetIscurrency] = useRecoilState(currencyState);

  const handleChangeCurrent = () => {
    SetIscurrency((prev) => !prev);
  };

  return (
    <div className={styles.categoryToggle}>
      <button
        type='button'
        onClick={handleChangeCurrent}
        className={iscurrency ? `${styles.currentUSD}` : ''}
        aria-label='toggle current'
      >
        <span>₩</span>
        <span>$</span>
      </button>
    </div>
  );
};

export default ToggleButton;
