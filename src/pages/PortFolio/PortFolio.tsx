import { useCallback, useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { coinListState, isLoginState, modalState } from '../../recoil/recoil';
import axios from 'axios';
import { getCoinOnlyPrice } from '../../services/getCoinApi';
import { IUserCoinList } from '../../types/coin';

import Modal from '../../components/Modal/Modal';

import styles from './portFolio.module.scss';

const MARKET_CATE = ['all', 'binance', 'upbit', 'bithumb'];

const PortFolio = () => {
  const uniqueId = localStorage.getItem('id');
  const [userCoinList, setUserCoinList] = useRecoilState<IUserCoinList[]>(coinListState);
  const [marketList, setMarketCoinList] = useState<IUserCoinList[]>([]);
  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const [marketValue, setMarketValue] = useState(false);

  const isLogin = useRecoilValue(isLoginState);

  const list = marketValue ? marketList : userCoinList;

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleShowMarketCoin = (value: any) => {
    const ml = userCoinList.filter((item) => {
      return value === 'all' ? item : item.market === value;
    });
    setMarketValue(true);
    setMarketCoinList(ml);
  };

  const getPortFolio = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/coin/getCoin/${uniqueId}`);
      const { coin } = res.data;
      const coinName = coin.map((item: any) => item.apiCallName).join(',');

      const coinPrice = await getCoinOnlyPrice({
        ids: coinName,
        vs_currencies: 'krw,usd',
      });

      const coinList = coin.map((item: any) => {
        const name = item.apiCallName;
        const price = coinPrice[name];
        const presentPrice = price[item.currency];
        return {
          ...item,
          price,
          totalAmount: item.average * item.quantity,
          evaluationAmount: presentPrice * item.quantity,
          valuationPL: presentPrice * item.quantity - item.average * item.quantity,
          return: ((presentPrice - item.average) / item.average) * 100,
        };
      });

      setUserCoinList(coinList);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  useEffect(() => {
    getPortFolio();
  }, []);

  return (
    <div className={styles.container}>
      {isLogin ? (
        <>
          <ul>
            {MARKET_CATE.map((item) => {
              return (
                <li key={Math.random() * 1000}>
                  <button type='button' onClick={() => handleShowMarketCoin(item)}>
                    {item}
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
                    {list.map((item: any) => {
                      return (
                        <tr key={Math.random() * 1000}>
                          <td>{item.date}</td>
                          <td>{item.market}</td>
                          <td>
                            <img src={item.thumb} alt={item.name} />
                            {item.name}
                          </td>
                          <td>{item.symbol}</td>
                          {/* 현재가 */}
                          <td>{`${item.currency === 'krw' ? `₩${item.price.krw}` : `$${item.price.usd}`}`}</td>
                          {/* 내평단 */}
                          <td>{`${item.currency === 'krw' ? `₩${item.average}` : `$${item.average}`}`}</td>
                          {/* 보유수량 */}
                          <td>{item.quantity}</td>
                          {/* 매수금액 */}
                          <td>{`${item.currency === 'krw' ? `₩${item.totalAmount}` : `$${item.totalAmount}`}`}</td>
                          {/* 평가금액 */}
                          <td>{`${
                            item.currency === 'krw' ? `₩${item.evaluationAmount}` : `$${item.evaluationAmount}`
                          }`}</td>
                          {/* 평가손익 */}
                          <td className={item.valuationPL > 0 ? `${styles.plus}` : `${styles.minus}`}>
                            {item.valuationPL > 0 ? `+${item.valuationPL.toFixed(2)}` : item.valuationPL.toFixed(2)}
                          </td>
                          {/* 수익률 */}
                          <td className={item.return > 0 ? `${styles.plus}` : `${styles.minus}`}>
                            {`${item.return.toFixed(2)}%`}
                          </td>
                        </tr>
                      );
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
