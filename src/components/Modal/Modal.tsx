import { ChangeEvent, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bookMarkCoinNameState, coinListState, dateState, modalState } from '../../recoil/recoil';
import axios from 'axios';

import { addCoinApi, getCoinSearchApi } from '../../services/getCoinApi';
import { ISearchCoin, IUserCoinList } from '../../types/coin';
import DateCalendar from '../DatePicker/DateCalendar';
import Radio from '../Radio/Radio';

import styles from './modal.module.scss';

const TRANSACTION_CATEGORY = ['buy', 'sell'];

interface ISearchValue {
  id: string;
  name: string;
  symbol: string;
  thumb: string;
}

const Modal = () => {
  const uniqueId = localStorage.getItem('id');

  const [marketValue, setMarketValue] = useState('upbit');
  const [searchValueId, setSearchValueId] = useState('');
  const [searchValueName, setSearchValueName] = useState('');
  const [searchValueSymbol, setSearchValueSymbol] = useState('');
  const [searchValueThumb, setSearchValueThumb] = useState('');
  const [searchResult, setSearchResult] = useState<ISearchCoin[]>([]);
  const [transaction, setTransaction] = useState('buy');
  const [transactionPrice, setTransactionPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const [isShowSearchResult, setIsShowSearchResult] = useState(false);
  const [modalError, setModalError] = useState('');

  const userCoinList = useRecoilValue<IUserCoinList[]>(coinListState);
  const date = useRecoilValue(dateState);
  const modalRef = useRef<HTMLDivElement>(null);

  const selectCurrency = marketValue === 'binance' ? 'usd' : 'krw';

  const bookMarkCoinName = useRecoilValue(bookMarkCoinNameState);

  const handleGetBookMark = async () => {
    if (bookMarkCoinName !== '') {
      const data = await getCoinSearchApi({
        query: bookMarkCoinName,
      });
      const bookMarkCoin = data.filter((items: ISearchCoin) => {
        return items.id === bookMarkCoinName;
      });
      setSearchValueId(bookMarkCoin[0].id);
      setSearchValueName(bookMarkCoin[0].name);
      setSearchValueSymbol(bookMarkCoin[0].symbol);
      setSearchValueThumb(bookMarkCoin[0].thumb);
    }
  };

  useEffect(() => {
    handleGetBookMark();
  }, []);

  const handleSearchInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleChangeChecked = (e: ChangeEvent<HTMLInputElement>) => {
    setMarketValue(e.currentTarget.value);
  };

  const handleChangeSearchInput = (item: ISearchValue) => {
    setSearchValueId(item.id);
    setSearchValueName(item.name);
    setSearchValueSymbol(item.symbol);
    setSearchValueThumb(item.thumb);
    setIsShowSearchResult(false);
  };

  const handleChangeTransaction = (item: string) => {
    setTransaction(item);
  };

  const handleChangePrice = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setTransactionPrice(Number(value));
    // setTransactionPrice(removedCommaValue.toLocaleString());
  };

  const handleChangeQuantity = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setQuantity(Number(value));
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
    const portFolioCoin = userCoinList.filter((item) => {
      return item.market === marketValue && item.apiCallName === searchValueId;
    });
    console.log(portFolioCoin);
    if (portFolioCoin.length > 0) {
      try {
        await axios.post('https://coin-moa.herokuapp.com/coin/update', {
          userId: uniqueId,
          apiCallName: searchValueId,
          market: marketValue,
          name: searchValueName,
          symbol: searchValueSymbol,
          thumb: searchValueThumb,
          currency: selectCurrency,
          date,
          transaction,
          transactionPrice,
          average:
            transaction === 'buy'
              ? portFolioCoin[0].average + Number(transactionPrice)
              : portFolioCoin[0].average - Number(transactionPrice),
          quantity:
            transaction === 'buy'
              ? portFolioCoin[0].quantity + Number(quantity)
              : portFolioCoin[0].quantity - Number(quantity),
          totalAmount:
            transaction === 'buy'
              ? portFolioCoin[0].totalAmount + Number(transactionPrice) * Number(quantity)
              : portFolioCoin[0].totalAmount - Number(transactionPrice) * Number(quantity),
        });

        window.location.reload();
        setIsOpenModal(false);
      } catch (error) {
        throw new Error((error as Error).message);
      }

      if (transaction === 'sell' && portFolioCoin[0].quantity - quantity <= 0) {
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
    }
    if (portFolioCoin.length === 0 && transaction === 'buy') {
      await addCoinApi(
        uniqueId,
        searchValueId,
        marketValue,
        searchValueName,
        searchValueSymbol,
        searchValueThumb,
        selectCurrency,
        transaction,
        date,
        transactionPrice,
        quantity
      );
      setIsOpenModal(false);
      window.location.reload();
    } else {
      setModalError('매도할 수 있는 코인이 없습니다');
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
            value={bookMarkCoinName || searchValueId}
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
          <span>{selectCurrency}</span>
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

        <p className={styles.errorMsg}>{modalError}</p>

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
