import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { coinListState, isLoginState, modalState } from '../../recoil/recoil';
import axios from 'axios';
import { getCoinOnlyPrice } from '../../services/getCoinApi';
import { IUserCoinList } from '../../types/coin';

import PortFolioItem from './PortFolioItem/PortFolioItem';
import Modal from '../../components/Modal/Modal';

import styles from './portFolio.module.scss';

const MARKET_CATE = ['binance', 'upbit', 'bithumb'];

const PortFolio = () => {
  const uniqueId = localStorage.getItem('id');
  const [userCoinList, setUserCoinList] = useRecoilState<IUserCoinList[]>(coinListState);
  const [marketList, setMarketCoinList] = useState<IUserCoinList[]>([]);
  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const [marketValue, setMarketValue] = useState(false);
  const [isCurrencyAssets, setIsCurrencyAssets] = useState(false);

  const isLogin = useRecoilValue(isLoginState);

  const list = marketValue ? marketList : userCoinList;

  const krwValuationPL = userCoinList.filter((item: IUserCoinList) => {
    return item.currency === 'krw';
  });
  const usdValuationPL = userCoinList.filter((item: IUserCoinList) => {
    return item.currency === 'usd';
  });

  const totalAssetsKRW = krwValuationPL.reduce((acc: number, cur: IUserCoinList) => {
    return acc + cur.valuationPL;
  }, 0);

  const totalAssetsUSD = usdValuationPL.reduce((acc: number, cur: IUserCoinList) => {
    return acc + cur.valuationPL;
  }, 0);

  const handleChangeCurrent = () => {
    setIsCurrencyAssets((prev) => !prev);
  };

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleShowMarketCoin = (value: string) => {
    const ml = userCoinList.filter((item) => {
      return item.market === value;
    });
    setMarketValue(true);
    setMarketCoinList(ml);
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
          totalAmount:
            item.currency === 'krw' ? `₩${item.average * item.quantity}` : `$${item.average * item.quantity}`,
          evaluationAmount:
            item.currency === 'krw' ? `₩${presentPrice * item.quantity}` : `$${presentPrice * item.quantity}`,
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

  return (
    <div className={styles.container}>
      {isLogin ? (
        <>
          <ul>
            <li>
              <button type='button' onClick={() => setMarketValue(false)}>
                <h3>총자산</h3>
                <p>{isCurrencyAssets ? `₩${totalAssetsKRW.toFixed(2)}` : `$${totalAssetsUSD}`}</p>
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
                  </button>
                </li>
              );
            })}
          </ul>

          <div className={styles.portFolioContents}>
            {list.length > 0 ? (
              <>
                <div className={styles.addBtn}>
                  <button type='button' onClick={handleOpenModal}>
                    추가하기
                  </button>
                </div>

                <table>
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
                      return <PortFolioItem key={item.symbol} item={item} />;
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
        <div className={styles.goLogin}>로그인해주세요</div>
      )}
    </div>
  );
};

export default PortFolio;
