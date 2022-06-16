import { useEffect, useState } from 'react';

import { getDominanceApi, getTrendingCoin } from '../../../services/getCoinApi';
import { IDominance, ITrendCoinArray } from '../../../types/coin';
import { useUnitCommaData } from '../../../utils/useUnitCommaData';

import { MarketCapIcon } from '../../../assets';
import TrendingIcon from '../../../assets/trendingIcon.png';
import upDownIcon from '../../../assets/upDownIcon.png';
import styles from './marketTopCard.module.scss';

const MarketTopCard = () => {
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

  const unitComma = useUnitCommaData;

  const handlePublicRank = async () => {
    const res = await getTrendingCoin();
    const data = res.slice(0, 3);
    setTrendCoin(data);
  };

  const getDominance = async () => {
    const res = await getDominanceApi();
    setDominance(res);
  };

  useEffect(() => {
    handlePublicRank();
    getDominance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article className={styles.marketTop}>
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

      {dominance && (
        <>
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
        </>
      )}
    </article>
  );
};

export default MarketTopCard;
