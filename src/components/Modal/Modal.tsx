import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { coinListState, dateState, modalState } from '../../recoil/recoil';
import axios from 'axios';

import { getCoinSearchApi } from '../../services/getCoinApi';
import { ISearchCoin, IUserCoinList } from '../../types/coin';
import DateCalendar from '../DatePicker/DateCalendar';
import Radio from '../Radio/Radio';

import { ArrowIcon } from '../../assets';
import styles from './modal.module.scss';

const CURRENCY_CATEGORY = ['usd', 'krw'];
const TRANSACTION_CATEGORY = ['buy', 'sell'];

const Modal = () => {
  const uniqueId = localStorage.getItem('id');

  const userCoinList = useRecoilValue<IUserCoinList[]>(coinListState);

  const [marketValue, setMarketValue] = useState('upbit');
  const [searchValueId, setSearchValueId] = useState('');
  const [searchValueName, setSearchValueName] = useState('');
  const [searchValueSymbol, setSearchValueSymbol] = useState('');
  const [searchValueThumb, setSearchValueThumb] = useState('');
  const [searchResult, setSearchResult] = useState<ISearchCoin[]>([]);
  const [transaction, setTransaction] = useState('buy');
  const [currency, setCurrency] = useState('usd');
  const [transactionPrice, setTransactionPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const date = useRecoilValue(dateState);

  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const [isShowDropdown, setIsShowDropdown] = useState(false);
  const [isShowSearchResult, setIsShowSearchResult] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  const selectCurrency = CURRENCY_CATEGORY.filter((item) => {
    return item !== currency;
  });

  const handleSearchInputChange = async (e: any) => {
    const { value } = e.currentTarget;
    setSearchValueId(value);
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
    setMarketValue(e.currentTarget.value);
  };

  const handleChangeSearchInput = (item: any) => {
    setSearchValueId(item.id);
    setSearchValueName(item.name);
    setSearchValueSymbol(item.symbol);
    setSearchValueThumb(item.thumb);
    setIsShowSearchResult(false);
  };

  const handleChangeTransaction = (item: any) => {
    setTransaction(item);
  };

  const handleChangeCurrency = (e: any) => {
    const { value } = e.currentTarget;
    setCurrency(value);
    setIsShowDropdown(false);
  };

  const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setTransactionPrice(Number(value));

    // setTransactionPrice(removedCommaValue.toLocaleString());
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

  const handleSubmitAddCoin = async () => {
    const aa = userCoinList.filter((item) => {
      return item.market === marketValue && item.apiCallName === searchValueId;
    });
    if (aa.length > 0) {
      try {
        await axios.post('https://coin-moa.herokuapp.com/coin/update', {
          userId: uniqueId,
          apiCallName: searchValueId,
          market: marketValue,
          name: searchValueName,
          symbol: searchValueSymbol,
          thumb: searchValueThumb,
          currency,
          transaction,
          date,
          transactionPrice,
          average:
            transaction === 'buy' ? aa[0].average + Number(transactionPrice) : aa[0].average - Number(transactionPrice),
          quantity: transaction === 'buy' ? aa[0].quantity + Number(quantity) : aa[0].quantity - Number(quantity),
          totalAmount:
            transaction === 'buy'
              ? aa[0].totalAmount + Number(transactionPrice) * Number(quantity)
              : aa[0].totalAmount - Number(transactionPrice) * Number(quantity),
        });
        window.location.reload();

        setIsOpenModal(false);
      } catch (error) {
        throw new Error((error as Error).message);
      }

      if (transaction === 'sell' && aa[0].quantity - quantity <= 0) {
        try {
          await axios.post('https://coin-moa.herokuapp.com/coin/delete', {
            userId: uniqueId,
            apiCallName: searchValueId,
            market: marketValue,
          });
          window.location.reload();
        } catch (error) {
          throw new Error((error as Error).message);
        }
      }
    } else {
      try {
        await axios.post('https://coin-moa.herokuapp.com/coin/coinAdd', {
          userId: uniqueId,
          apiCallName: searchValueId,
          market: marketValue,
          name: searchValueName,
          symbol: searchValueSymbol,
          thumb: searchValueThumb,
          currency,
          transaction,
          date,
          transactionPrice,
          average: Number(transactionPrice),
          quantity,
          totalAmount: Number(transactionPrice) * quantity,
        });
        setIsOpenModal(false);
        window.location.reload();
      } catch (error) {
        throw new Error((error as Error).message);
      }
    }
  };

  return ReactDOM.createPortal(
    <div className={styles.modalWrap}>
      <div className={styles.modalContainer} ref={modalRef}>
        <h3>거래소</h3>
        <div className={styles.radioWrap}>
          <Radio label='업비트' id='upbit' onChange={handleChangeChecked} checked={marketValue === 'upbit'} />
          <Radio label='빗썸' id='bithumb' onChange={handleChangeChecked} checked={marketValue === 'bithumb'} />
          <Radio label='바이낸스' id='binance' onChange={handleChangeChecked} checked={marketValue === 'binance'} />
        </div>

        <h3>날짜</h3>
        <div className={styles.dateWrap}>
          <DateCalendar />
        </div>

        <h3>코인이름</h3>
        <div className={styles.searchWrap}>
          <input
            type='text'
            value={searchValueId}
            onChange={handleSearchInputChange}
            placeholder='코인을 입력해주세요'
          />
          {isShowSearchResult && (
            <ul>
              {searchResult.map((item) => {
                return (
                  <li key={Math.random() * 1000}>
                    <button type='button' onClick={() => handleChangeSearchInput(item)}>
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
              <button
                key={Math.random() * 1000}
                type='button'
                onClick={() => handleChangeTransaction(item)}
                className={transaction === item ? `${styles.active}` : ''}
              >
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
                  <button type='button' onClick={handleChangeCurrency} value={selectCurrency}>
                    {selectCurrency}
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
          <button type='button' onClick={handleSubmitAddCoin}>
            추가
          </button>
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
