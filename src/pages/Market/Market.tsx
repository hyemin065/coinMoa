import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { bookMarkCoinNameState, coinListState, currencyState, modalState } from '../../recoil/recoil';
import { getCoinMarketApi, getPortFolioApi } from '../../services/getCoinApi';
import { IMarketCoin, IUserCoinList } from '../../types/coin';
import ScrollTopButton from '../../components/ScrollTopButton/ScrollTopButton';
import Modal from '../../components/Modal/Modal';
import MarketItem from './MarketItem/MarketItem';
import ToggleButton from '../../components/Toggle/ToggleButton';
import MarketTopCard from './MarketTopCard/MarketTopCard';

import styles from './market.module.scss';
import Loading from '../../assets/loading.gif';

const PAGINATION = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Market = () => {
  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const setBookMarkCoin = useSetRecoilState<IUserCoinList[]>(coinListState);
  const setBookMarkCoinName = useSetRecoilState(bookMarkCoinNameState);
  const iscurrency = useRecoilValue(currencyState);

  const [isLoading, setIsLoading] = useState(true);
  const [coinList, setCoinList] = useState<IMarketCoin[]>([]);

  const [page, setPage] = useState(PAGINATION[0]);

  const navigate = useNavigate();
  const uniqueId = localStorage.getItem('id');

  const currentText = iscurrency ? 'USD' : 'KRW';

  const handleClickPage = (item: number) => {
    setPage(item);
  };

  const handleOpenModal = () => {
    if (uniqueId !== null) {
      setIsOpenModal(true);
    } else {
      setIsOpenModal(false);
    }
  };

  const handleBookMarkGetName = (name: any) => {
    if (uniqueId !== null) {
      setBookMarkCoinName(name);
    } else {
      navigate('/signIn');
    }
  };

  const getApiData = async () => {
    const res = await getCoinMarketApi({
      order: 'market_cap_des',
      per_page: 100,
      page,
      sparkline: false,
      vs_currency: iscurrency ? 'usd' : 'krw',
    });
    if (res.length > 0) {
      setCoinList(res);
      setIsLoading(false);
    }
  };

  const getPortFolio = async () => {
    const data = await getPortFolioApi();

    if (data.length > 0) {
      setBookMarkCoin(data);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getApiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, iscurrency]);

  useEffect(() => {
    getPortFolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      {!isLoading ? (
        <section className={styles.marketWrap}>
          <ScrollTopButton />

          <article className={styles.titleWrap}>
            <h2>
              시가총액별 암호화폐 시세
              <span>({currentText})</span>
            </h2>
            <p>
              전 세계 암호화폐 시가총액은 $1.28조입니다.
              <br />
              COINMOA는 현재 13,442개의 암호화폐를 추적하고 있습니다. 현재 업계의 인기 있는 트렌드는 DeFi 및 Play to
              Earn 입니다.
            </p>
          </article>

          <MarketTopCard />

          <ToggleButton />

          <table className={styles.marketTable}>
            <thead>
              <tr>
                <th colSpan={2}>#</th>
                <th colSpan={2}>코인</th>
                <th>현재가</th>
                <th>최고가(24h)</th>
                <th>최저가(24h)</th>
                <th>전일대비</th>
                <th>24시간 거래량</th>
                <th>시가총액</th>
              </tr>
            </thead>
            <tbody>
              {coinList &&
                coinList.map((item) => {
                  return (
                    <MarketItem
                      key={item.id}
                      item={item}
                      currency={iscurrency}
                      handleOpenModal={handleOpenModal}
                      handleBookMarkGetName={handleBookMarkGetName}
                    />
                  );
                })}
            </tbody>
          </table>

          <ol>
            {PAGINATION.map((item) => {
              return (
                <li key={`page_${item}`}>
                  <button
                    type='button'
                    className={item === page ? `${styles.active}` : ''}
                    onClick={() => handleClickPage(item)}
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ol>

          {isOpenModal && <Modal />}
        </section>
      ) : (
        <div className={styles.loadingWrap}>
          <img src={Loading} alt='loading' />
        </div>
      )}
    </div>
  );
};

export default Market;
