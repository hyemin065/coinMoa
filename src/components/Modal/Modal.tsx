import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useRecoilState } from 'recoil';
import { ArrowIcon } from '../../assets';
import { modalState } from '../../recoil/recoil';
import styles from './modal.module.scss';

const Modal = () => {
  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const modalRef = useRef<HTMLDivElement>(null);

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
        <h3>거래소</h3>
        <div className={styles.radioWrap}>
          <label htmlFor='upbit'>업비트</label>
          <input type='radio' value='업비트' name='radio' id='upbit' />

          <label htmlFor='bainane'>바이낸스</label>
          <input type='radio' value='바이낸스' name='radio' id='bainane' />

          <label htmlFor='bit'>업비트</label>
          <input type='radio' value='빗썸' name='radio' id='bit' />
        </div>
        <div>
          <label htmlFor='buy'>매수가</label>
          <input type='text' id='buy' />
        </div>
        <div>
          <label htmlFor='buy'>날짜</label>
          {/* datePicker */}
        </div>
        <div className={styles.buttonWrap}>
          <button type='button'>추가</button>
          <button type='button' onClick={handleCloseModal}>
            취소
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('modal') as HTMLElement
  );
};

export default Modal;
