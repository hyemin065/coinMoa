import { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useRecoilState } from 'recoil';
import { modalState } from '../../recoil/recoil';
import DateCalendar from '../DatePicker/DateCalendar';
import styles from './modal.module.scss';

const Modal = () => {
  const [radioChecked, setRadioChecked] = useState('upbit');

  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleChangeChecked = (e: any) => {
    setRadioChecked(e.currentTarget.value);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    document.addEventListener('mousedown', clickModalOutside);

    return () => {
      document.removeEventListener('mousedown', clickModalOutside);
    };
  });

  const clickModalOutside = (e: MouseEvent) => {
    if (!modalRef.current) return;
    if (isOpenModal && !modalRef.current.contains(e.target as Node)) {
      handleCloseModal();
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modalWrap}>
      <div className={styles.modalContainer} ref={modalRef}>
        <div className={styles.modalContents}>
          <h3>거래소</h3>
          <div className={styles.radioWrap}>
            <label htmlFor='upbit' className={styles.label}>
              업비트
              <input
                type='radio'
                value='upbit'
                name='market'
                id='upbit'
                onChange={handleChangeChecked}
                checked={radioChecked === 'upbit'}
              />
              <span className={styles.checkmark} />
            </label>

            <label htmlFor='bithumb' className={styles.label}>
              빗썸
              <input
                type='radio'
                value='bithumb'
                name='market'
                id='bithumb'
                onChange={handleChangeChecked}
                checked={radioChecked === 'bithumb'}
              />
              <span className={styles.checkmark} />
            </label>

            <label htmlFor='binance' className={styles.label}>
              바이낸스
              <input
                type='radio'
                value='binance'
                name='market'
                id='binance'
                onChange={handleChangeChecked}
                checked={radioChecked === 'binance'}
              />
              <span className={styles.checkmark} />
            </label>
          </div>

          <h3>매수가</h3>
          <div className={styles.inputWrap}>
            <input type='text' placeholder='매수가를 입력해주세요' />
          </div>

          <h3>날짜</h3>
          <div className={styles.dateWrap}>
            <DateCalendar />
          </div>
          <div className={styles.buttonWrap}>
            <button type='button'>추가</button>
            <button type='button' onClick={handleCloseModal}>
              취소
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modal') as HTMLElement
  );
};

export default Modal;
