import { useEffect, useState } from 'react';

import { getCoinMarketApi } from '../../services/getCoinApi';
import { IMarketCoin } from '../../types/coin';
import MarketItem from './MarketItem/MarketItem';

import styles from './market.module.scss';

const PAGINATION = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Market = () => {
  const [coinList, setCoinList] = useState<IMarketCoin[]>([]);
  const [iscurrency, setIsCurrent] = useState(false);
  const [page, setPage] = useState(PAGINATION[0]);

  const currentText = iscurrency ? 'USD' : 'KRW';

  const handleChangeCurrent = () => {
    setIsCurrent((prev) => !prev);
  };

  const handleClickPage = (item: number) => {
    setPage(item);
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

  useEffect(() => {
    getApiData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, iscurrency]);

  return (
    <div className={styles.container}>
      <div className={styles.titleWrap}>
        <div>
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
        </div>
        <div className={styles.toggle}>
          <button
            type='button'
            onClick={handleChangeCurrent}
            className={iscurrency ? `${styles.currentUSD}` : ''}
            aria-label='toggle current'
          >
            <span>₩</span>
            <span>$</span>
          </button>
        </div>
      </div>

      <table>
        <colgroup>
          <col width='8%' />
          <col width='16%' />
          <col width='6%' />
          <col width='10%' />
          <col width='12%' />
          <col width='12%' />
          <col width='12%' />
          <col width='12%' />
          <col width='12%' />
        </colgroup>
        <thead>
          <tr>
            <th>#</th>
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
              return <MarketItem key={item.id} item={item} currency={iscurrency} />;
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
    </div>
  );
};

export default Market;
