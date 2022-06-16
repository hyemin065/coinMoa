import { useEffect, useState } from 'react';

import { getExchange } from '../../services/getCoinApi';
import { IExchange } from '../../types/coin';
import { useUnitCommaData } from '../../utils/useUnitCommaData';
import ScrollTopButton from '../../components/ScrollTopButton/ScrollTopButton';

import styles from './exchange.module.scss';

const PAGINATION = [1, 2, 3];

const Exchange = () => {
  const [exchange, setExchange] = useState<IExchange[]>([]);
  const [page, setPage] = useState(1);

  const getExchangeApi = async () => {
    const data = await getExchange({
      page,
    });
    setExchange(data);
  };

  useEffect(() => {
    getExchangeApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleClickPage = (item: number) => {
    setPage(item);
  };
  const unitComma = useUnitCommaData;
  return (
    <div className={styles.container}>
      <ScrollTopButton />
      <article className={styles.titleWrap}>
        <h2>암호화폐 현물 거래소</h2>
        <p>
          트래픽, 유동성, 거래량 및 보고된 거래량의
          <br /> 정당성에 대한 신뢰도를 기준으로 거래소의 순위를 매기고 거래량을 파악한 상위 100개의 거래소입니다.
        </p>
      </article>
      <table className={styles.exchangeTable}>
        <colgroup>
          <col width='10%' />
          <col width='25%' />
          <col width='15%' />
          <col width='20%' />
          <col width='30%' />
        </colgroup>
        <thead>
          <tr>
            <th>#</th>
            <th>이름</th>
            <th>신뢰 점수</th>
            <th>BTC 거래량 (24h)</th>
            <th>사이트 주소</th>
          </tr>
        </thead>
        <tbody>
          {exchange.map((item) => {
            return (
              <tr key={item.id}>
                <td>{item.trust_score_rank}</td>
                <td>
                  <img src={item.image} alt={item.id} />
                  {item.name}
                </td>
                <td>
                  {item.trust_score !== null ? (
                    <div className={styles.graph}>
                      <span
                        className={item.trust_score <= 5 ? `${styles.warning}` : ''}
                        style={item.trust_score !== null ? { width: `${item.trust_score * 10}%` } : { width: 0 }}
                      />
                      <p>{item.trust_score}</p>
                    </div>
                  ) : (
                    <div>N/A</div>
                  )}
                </td>
                <td>{unitComma(true, item.trade_volume_24h_btc.toFixed(2))}</td>
                <td>
                  <a href={item.url} target='_blank' rel='noreferrer'>
                    {item.url}
                  </a>
                </td>
              </tr>
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
    </div>
  );
};
export default Exchange;
