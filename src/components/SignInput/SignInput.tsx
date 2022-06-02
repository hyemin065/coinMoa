import styles from './input.module.scss';

interface IProps {
  label: string;
  type: string;
  id: string;
  onChange: any;
  check: boolean;
  onClick?: any;
}
const SignInput = ({ label, type, id, onChange, check, onClick }: IProps) => {
  return (
    <>
      <label htmlFor={id} className={styles.signLabel}>
        {label}
      </label>
      <div className={styles.inputWrap}>
        <input type={type} id={id} onChange={onChange} />
        <span className={styles.focused} />
        {check && (
          <button type='button' onClick={onClick}>
            중복확인
          </button>
        )}
      </div>
    </>
  );
};

export default SignInput;
