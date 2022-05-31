import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useRecoilState } from 'recoil';
import { ArrowIcon } from '../../assets';
import { modalState } from '../../recoil/recoil';
import DateCalendar from '../DatePicker/DateCalendar';
import Radio from '../Radio/Radio';
import styles from './modal.module.scss';

const CURRENCY_CATEGORY = ['USD', 'KRW'];

const Modal = () => {
  const [radioChecked, setRadioChecked] = useState('upbit');
  const [buyPrice, setBuyPrice] = useState('');
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const modalRef = useRef<HTMLDivElement>(null);

  const SelectCurrency = CURRENCY_CATEGORY.filter((item) => {
    return item !== currency;
  });

  const handleChangeChecked = (e: any) => {
    setRadioChecked(e.currentTarget.value);
  };

  const handleChangeCurrency = (e: any) => {
    const { value } = e.currentTarget;
    setCurrency(value);
    setIsShowDropdown(false);
  };

  const handleClickDropdown = () => {
    setIsShowDropdown((prev) => !prev);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    const removedCommaValue = Number(value.replaceAll(',', ''));
    setBuyPrice(removedCommaValue.toLocaleString());
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
            <Radio label='업비트' id='upbit' onChange={handleChangeChecked} checked={radioChecked === 'upbit'} />
            <Radio label='빗썸' id='bithumb' onChange={handleChangeChecked} checked={radioChecked === 'bithumb'} />
            <Radio label='바이낸스' id='binance' onChange={handleChangeChecked} checked={radioChecked === 'binance'} />
          </div>

          <h3>날짜</h3>
          <div className={styles.dateWrap}>
            <DateCalendar />
          </div>

          <h3>매수가</h3>
          <div className={styles.inputWrap}>
            <div className={styles.dropdown}>
              <button type='button' onClick={handleClickDropdown}>
                {currency}
                <ArrowIcon />
              </button>
              {isShowDropdown && (
                <ul>
                  <li>
                    <button type='button' onClick={handleChangeCurrency} value={SelectCurrency}>
                      {SelectCurrency}
                    </button>
                  </li>
                </ul>
              )}
            </div>
            <input type='text' placeholder='매수가를 입력해주세요' value={buyPrice} onChange={handleChangePrice} />
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
