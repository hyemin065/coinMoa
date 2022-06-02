import axios from 'axios';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ArrowIcon } from '../../assets';
import { coinUpdateState, dateState, modalState } from '../../recoil/recoil';
import { getCoinSearchApi } from '../../services/getCoinApi';
import { ISearchCoin } from '../../types/coin';
import DateCalendar from '../DatePicker/DateCalendar';
import Radio from '../Radio/Radio';
import styles from './modal.module.scss';

const CURRENCY_CATEGORY = ['USD', 'KRW'];
const TRANSACTION_CATEGORY = ['buy', 'sell'];

const Modal = () => {
  const uniqueId = localStorage.getItem('id');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState<ISearchCoin[]>([]);

  const [radioChecked, setRadioChecked] = useState('upbit');
  const [transactionPrice, setTransactionPrice] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [isShowSearchResult, setIsShowSearchResult] = useState(false);
  const [currency, setCurrency] = useState('USD');

  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const modalRef = useRef<HTMLDivElement>(null);

  const SelectCurrency = CURRENCY_CATEGORY.filter((item) => {
    return item !== currency;
  });

  const handleSearchInputChange = async (e: any) => {
    const { value } = e.currentTarget;
    setSearchValue(value);
    if (value !== '') {
      const res = await getCoinSearchApi({
        query: value,
      });
      setSearchResult(res);
      if (res.length > 0) {
        setIsShowSearchResult(true);
      } else {
        setIsShowSearchResult(false);
      }
    } else {
      setIsShowSearchResult(false);
    }
  };

  const handleChangeChecked = (e: any) => {
    setRadioChecked(e.currentTarget.value);
  };

  const handleChangeCurrency = (e: any) => {
    const { value } = e.currentTarget;
    setCurrency(value);
    setIsShowDropdown(false);
  };
  const handleChangeQuantity = (e: any) => {
    const { value } = e.currentTarget;
    setQuantity(value);
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
    setTransactionPrice(removedCommaValue.toLocaleString());
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

  const handleChangeSearchInput = (item: any) => {
    setSearchValue(item);
    setIsShowSearchResult(false);
  };

  const [transaction, setTransaction] = useState('매수가');
  const handleChangeTransaction = (item: any) => {
    setTransaction(item);
  };

  const date = useRecoilValue(dateState);
  const [coinUpdateList, setCoinUpdateList] = useRecoilState(coinUpdateState);

  const bbb = async () => {
    try {
      const res = await axios.post('http://localhost:5000/coin/update', {
        userId: uniqueId,
        apiCallName: searchValue,
        average: Number(transactionPrice) * quantity,
        quantity,
        totalAmount: Number(transactionPrice) * quantity,
        valuationAmount: 24000,
      });
      const { data } = res;
      console.log(data);
      // setCoinUpdateList(data);
    } catch (error) {
      console.log(error);
    }

    console.log(radioChecked, transaction, date, searchValue, currency, transactionPrice);
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

          <h3>코인이름</h3>
          <div className={styles.searchWrap}>
            <input
              type='text'
              value={searchValue}
              onChange={handleSearchInputChange}
              placeholder='코인을 입력해주세요'
            />
            {isShowSearchResult && (
              <ul>
                {searchResult.map((item) => {
                  return (
                    <li key={Math.random() * 1000}>
                      <button type='button' onClick={() => handleChangeSearchInput(item.id)}>
                        {item.id}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <h3>거래</h3>
          <div className={styles.transactionWrap}>
            {TRANSACTION_CATEGORY.map((item) => {
              return (
                <button key={Math.random() * 1000} type='button' onClick={() => handleChangeTransaction(item)}>
                  {item === 'buy' ? '매수' : '매도'}
                </button>
              );
            })}
          </div>

          <h3>거래가격</h3>
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
            <input
              type='text'
              placeholder='매수가를 입력해주세요'
              value={transactionPrice}
              onChange={handleChangePrice}
            />
          </div>

          <h3>수량</h3>
          <div className={styles.quantityWrap}>
            <input type='number' placeholder='수량을 입력해주세요' onChange={handleChangeQuantity} value={quantity} />
          </div>

          <div className={styles.buttonWrap}>
            <button type='button' onClick={bbb}>
              추가
            </button>
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
