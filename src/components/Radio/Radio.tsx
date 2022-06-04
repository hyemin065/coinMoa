import { ChangeEvent } from 'react';
import styles from './radio.module.scss';

interface IProps {
  label: string;
  id: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}
const Radio = ({ label, id, onChange, checked }: IProps) => {
  return (
    <label htmlFor={id} className={styles.radioLabel}>
      {label}
      <input type='radio' id={id} value={id} name='market' onChange={onChange} checked={checked} />
      <span className={styles.checkmark} />
    </label>
  );
};

export default Radio;
