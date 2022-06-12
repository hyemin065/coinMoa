import { useEffect, useState } from 'react';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { bookMarkCoinNameState, coinListState, currencyState, modalState } from '../../recoil/recoil';
import { getCoinMarketApi, getDominanceApi, getPortFolioApi, getTrendingCoin } from '../../services/getCoinApi';
import { IDominance, IMarketCoin, ITrendCoinArray, IUserCoinList } from '../../types/coin';
import ScrollTopButton from '../../components/ScrollTopButton/ScrollTopButton';
import Modal from '../../components/Modal/Modal';
import MarketItem from './MarketItem/MarketItem';
import { useUnitCommaData } from '../../utils/useUnitCommaData';

import { MarketCapIcon } from '../../assets';
import TrendingIcon from '../../assets/trendingIcon.png';
import upDownIcon from '../../assets/upDownIcon.png';
import styles from './market.module.scss';
import ToggleButton from '../../components/Toggle/ToggleButton';

const PAGINATION = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Market = () => {
  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const setBookMarkCoin = useSetRecoilState<IUserCoinList[]>(coinListState);
  const setBookMarkCoinName = useSetRecoilState(bookMarkCoinNameState);
  const iscurrency = useRecoilValue(currencyState);

  const [coinList, setCoinList] = useState<IMarketCoin[]>([]);
  const [trendCoin, setTrendCoin] = useState<ITrendCoinArray[]>([]);
  const [dominance, setDominance] = useState<IDominance>({
    eth_dominance: 0,
    btc_dominance: 0,
    eth_dominance_24h_percentage_change: 0,
    btc_dominance_24h_percentage_change: 0,
    defi_volume_24h: 0,
    defi_market_cap: 0,
    defi_24h_percentage_change: 0,
    stablecoin_volume_24h: 0,
    stablecoin_market_cap: 0,
    stablecoin_24h_percentage_change: 0,
    derivatives_volume_24h: 0,
    derivatives_24h_percentage_change: 0,
  });
  const [page, setPage] = useState(PAGINATION[0]);

  const currentText = iscurrency ? 'USD' : 'KRW';

  const unitComma = useUnitCommaData;

  const handleClickPage = (item: number) => {
    setPage(item);
  };

  const handlePublicRank = async () => {
    const res = await getTrendingCoin();
    const data = res.slice(0, 3);
    setTrendCoin(data);
  };

  const getDominance = async () => {
    const res = await getDominanceApi();
    setDominance(res);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleBookMarkGetName = (name: any) => {
    setBookMarkCoinName(name);
  };

  const getApiData = async () => {
    const res = await getCoinMarketApi({
      order: 'market_cap_des',
      per_page: 100,
      page,
      sparkline: false,
      vs_currency: iscurrency ? 'usd' : 'krw',
    });
    setCoinList(res);
  };

  const getPortFolio = async () => {
    const data = await getPortFolioApi();
    setBookMarkCoin(data);
  };

  useEffect(() => {
    getApiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, iscurrency]);

  useEffect(() => {
    handlePublicRank();
    getPortFolio();
    getDominance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      <ScrollTopButton />
      <section className={styles.titleWrap}>
        <h2>
          시가총액별 암호화폐 시세
          <span>({currentText})</span>
        </h2>
        <p>
          전 세계 암호화폐 시가총액은 $1.28조입니다.
          <br />
          COINMOA는 현재 13,442개의 암호화폐를 추적하고 있습니다. 현재 업계의 인기 있는 트렌드는 DeFi 및 Play to Earn
          입니다.
        </p>
      </section>

      <section className={styles.marketTop}>
        <div className={styles.trendWrap}>
          <div className={styles.title}>
            <img src={TrendingIcon} alt='trendIcon' />
            <h3>실시간 인기 코인 순위</h3>
          </div>
          <ul>
            {trendCoin.map((item) => {
              return (
                <li key={item.item.coin_id}>
                  <span>{item.item.score + 1}</span>
                  <div>
                    <dl>
                      <dt>
                        <img src={item.item.thumb} alt='' />
                        {item.item.name}
                      </dt>
                      <dd>{item.item.symbol}</dd>
                    </dl>
                    <p>#.{item.item.market_cap_rank}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className={styles.dominanceWrap}>
          <div className={styles.title}>
            <img src={upDownIcon} alt='dominance' />
            <h3>도미넌스</h3>
          </div>
          <ul>
            <li>
              <dl>
                <dt>BTC.D</dt>
                <dd>{`${dominance.btc_dominance.toFixed(2)}%`}</dd>
              </dl>
              <p
                className={dominance.btc_dominance_24h_percentage_change > 0 ? `${styles.plus}` : `${styles.minus}`}
              >{`${dominance.btc_dominance_24h_percentage_change.toFixed(2)}%`}</p>
            </li>
            <li>
              <dl>
                <dt>ETH.D</dt>
                <dd>{`${dominance.eth_dominance.toFixed(2)}%`}</dd>
              </dl>
              <p
                className={dominance.eth_dominance_24h_percentage_change > 0 ? `${styles.plus}` : `${styles.minus}`}
              >{`${dominance.eth_dominance_24h_percentage_change.toFixed(2)}%`}</p>
            </li>
          </ul>
        </div>

        <div className={styles.markeCapWrap}>
          <div className={styles.title}>
            <MarketCapIcon />
            <h3>카테고리별 시가총액</h3>
          </div>
          <ul>
            <li>
              <dl>
                <dt>Defi Volume (24h)</dt>
                <dd>{unitComma(true, `${dominance.defi_volume_24h.toFixed(2)}`)}</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>Defi MarketCap</dt>
                <dd>{unitComma(true, `${dominance.defi_market_cap.toFixed(2)}`)}</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>Stablecoin Volume(24h)</dt>
                <dd>{unitComma(true, `${dominance.stablecoin_volume_24h.toFixed(2)}`)}</dd>
              </dl>
            </li>
            <li>
              <dl>
                <dt>Stablecoin MarketCap</dt>
                <dd>{unitComma(true, `${dominance.stablecoin_market_cap.toFixed(2)}`)}</dd>
              </dl>
            </li>
          </ul>
        </div>
      </section>

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
    </div>
  );
};

export default Market;
