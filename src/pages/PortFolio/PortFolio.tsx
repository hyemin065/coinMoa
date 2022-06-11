import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { bookMarkCoinNameState, coinListState, isLoginState, modalState } from '../../recoil/recoil';
import axios from 'axios';
import { getCoinOnlyPrice } from '../../services/getCoinApi';
import { IUserCoinList } from '../../types/coin';

import Modal from '../../components/Modal/Modal';

import styles from './portFolio.module.scss';
import { Link } from 'react-router-dom';
import PortFolioItem from './PortFolioItem/PortFolioItem';
import { useUnitCommaData } from '../../utils/useUnitCommaData';

const MARKET_CATE = ['binance', 'upbit', 'bithumb'];

const PortFolio = () => {
  const uniqueId = localStorage.getItem('id');
  const [userCoinList, setUserCoinList] = useRecoilState<IUserCoinList[]>(coinListState);
  const [marketList, setMarketCoinList] = useState<IUserCoinList[]>([]);
  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const [marketValue, setMarketValue] = useState(false);
  const [isCurrencyAssets, setIsCurrencyAssets] = useState(false);
  const setBookMarkCoinName = useSetRecoilState(bookMarkCoinNameState);
  const isLogin = useRecoilValue(isLoginState);

  const list = marketValue ? marketList : userCoinList;
  // console.log(list);
  const unitComma = useUnitCommaData;

  const krwValuationPL = userCoinList.filter((item: IUserCoinList) => {
    return item.currency === 'krw';
  });
  const usdValuationPL = userCoinList.filter((item: IUserCoinList) => {
    return item.currency === 'usd';
  });

  const totalAssetsKRW = krwValuationPL.reduce((acc: number, cur: IUserCoinList) => {
    return acc + cur.evaluationAmount;
  }, 0);

  const totalAssetsUSD = usdValuationPL.reduce((acc: number, cur: IUserCoinList) => {
    return acc + cur.evaluationAmount;
  }, 0);

  const handleChangeCurrent = () => {
    setIsCurrencyAssets((prev) => !prev);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleShowMarketCoin = (value: string) => {
    const marketCoins = userCoinList.filter((item) => {
      return item.market === value;
    });
    setMarketValue(true);
    setMarketCoinList(marketCoins);
  };

  const handleBookMarkGetName = (name: any) => {
    setBookMarkCoinName(name);
  };

  const getPortFolio = async () => {
    try {
      const res = await axios.get(`https://coin-moa.herokuapp.com/coin/getCoin/${uniqueId}`);
      const { coin } = res.data;
      const coinName = coin.map((item: IUserCoinList) => item.apiCallName).join(',');

      const coinPrice = await getCoinOnlyPrice({
        ids: coinName,
        vs_currencies: 'krw,usd',
      });

      const coinList = coin.map((item: IUserCoinList) => {
        const name = item.apiCallName;
        const price = coinPrice[name];
        const presentPrice = price[item.currency];

        return {
          ...item,
          price,
          totalAmount: item.average * item.quantity,
          average: item.average,
          evaluationAmount: presentPrice * item.quantity,
          valuationPL: presentPrice * item.quantity - item.average * item.quantity,
          return: (((presentPrice - item.average) / item.average) * 100).toFixed(2),
        };
      });

      setUserCoinList(coinList);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  useEffect(() => {
    getPortFolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGetMarketAssets = (marketVal: string) => {
    const market = userCoinList.filter((item) => item.market === marketVal);

    const totalAssets = market.reduce((acc, cur) => {
      const marketAssets = {
        binance: acc + cur.evaluationAmount,
        upbit: acc + cur.evaluationAmount,
        bithumb: acc + cur.evaluationAmount,
      }[marketVal];
      if (!marketAssets) return 0;
      return marketAssets;
    }, 0);
    return marketVal === 'binance'
      ? `${unitComma(false, totalAssets.toFixed(2))}`
      : `${unitComma(true, totalAssets.toFixed(2))}`;
  };

  return (
    <div className={styles.container}>
      {isLogin ? (
        <>
          <ul>
            <li>
              <button type='button' onClick={() => setMarketValue(false)}>
                <h3>총자산</h3>
                <p>{unitComma(isCurrencyAssets, isCurrencyAssets ? `${totalAssetsUSD}` : `${totalAssetsKRW}`)}</p>
              </button>
              <div className={styles.toggle}>
                <button
                  className={isCurrencyAssets ? `${styles.currentUSD}` : ''}
                  type='button'
                  onClick={handleChangeCurrent}
                  aria-label='toggle current'
                />
              </div>
            </li>

            {MARKET_CATE.map((item) => {
              return (
                <li key={Math.random() * 1000}>
                  <button type='button' onClick={() => handleShowMarketCoin(item)}>
                    <span className={styles.marketName}>{item}</span>
                    <h3>{item} 자산</h3>
                    <p>{handleGetMarketAssets(item)} </p>
                  </button>
                  <div />
                </li>
              );
            })}
          </ul>

          <div className={styles.portFolioContents}>
            {list.length > 0 ? (
              <>
                <div className={styles.addBtn}>
                  <button
                    type='button'
                    onClick={() => {
                      handleOpenModal();
                      handleBookMarkGetName('');
                    }}
                  >
                    추가하기
                  </button>
                </div>

                <table className={styles.portFolioTable}>
                  <thead>
                    <tr>
                      <th>거래일</th>
                      <th>거래소</th>
                      <th colSpan={2}>코인</th>
                      <th>현재가</th>
                      <th>평단</th>
                      <th>수량</th>
                      <th>매수금액</th>
                      <th>평가금액</th>
                      <th>평가손익</th>
                      <th>수익률</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((item: IUserCoinList) => {
                      return <PortFolioItem key={`${item.market}_${item.symbol}`} item={item} />;
                    })}
                  </tbody>
                </table>
              </>
            ) : (
              <div className={styles.addBtnWrap}>
                <button type='button' onClick={handleOpenModal}>
                  추가하기
                </button>
              </div>
            )}
            {isOpenModal && <Modal />}
          </div>
        </>
      ) : (
        <div className={styles.goLogin}>
          <p>로그인 후 이용하실 수 있습니다</p>
          <Link to='/signin'>로그인</Link>
        </div>
      )}
    </div>
  );
};

export default PortFolio;
