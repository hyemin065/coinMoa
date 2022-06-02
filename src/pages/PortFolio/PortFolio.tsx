import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import Modal from '../../components/Modal/Modal';
import { isLoginState, modalState } from '../../recoil/recoil';
import { getCoinOnlyPrice } from '../../services/getCoinApi';
import { IUserCoinList } from '../../types/coin';
import styles from './portFolio.module.scss';

const cate = ['binance', 'upbit', 'bithumb'];
const PortFolio = () => {
  const [count, setCount] = useState<any>([]);
  const [userCoinList, setUserCoinList] = useState<IUserCoinList[]>([]);
  const uniqueId = localStorage.getItem('id');

  const isLogin = useRecoilValue(isLoginState);

  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);

  const handleOpenModal = () => {
    setIsOpenModal(true);
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
        return { ...item, price, totalAmount: item.buyPrice * item.quantity };
      });

      setUserCoinList(coinList);

      if (count.length === 0) {
        setCount(coinList);
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  };

  useEffect(() => {
    getPortFolio();
  }, []);

  const handleClickBinance = (value: any) => {
    userCoinList.filter((item) => {
      return item.market === value;
    });
  };

  return (
    <div className={styles.container}>
      {isLogin ? (
        <>
          {' '}
          <ul>
            <li>
              <button type='button'>
                <h3>총자산</h3>
                <p>$2,000.00</p>
                <dl>
                  <dt>전체 평가손익</dt>
                  <dd>-$23,333(-45%)</dd>
                </dl>
              </button>
            </li>
            {cate.map((item) => {
              return (
                <li key={Math.random() * 1000}>
                  <button type='button' onClick={() => handleClickBinance(item)}>
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
          <div className={styles.portFolioContents}>
            <div className={styles.addBtn}>
              <button type='button' onClick={handleOpenModal}>
                + 추가하기
              </button>
            </div>

            {userCoinList.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>거래소</th>
                    <th>코인</th>
                    <th>현재가</th>
                    <th>보유평단</th>
                    <th>보유수량</th>
                    <th>매수금액</th>
                    <th>평가금액</th>
                    <th>평가손익</th>
                    <th>수익률</th>
                  </tr>
                </thead>
                <tbody>
                  {userCoinList.map((item: any) => {
                    return (
                      <tr key={Math.random() * 1000}>
                        <td>{item.market}</td>
                        <td>{item.name}</td>
                        {/* 현재가 */}
                        {/* <td>{`${item.currency} ${item.price.krw} (${item.price.usd})`}</td> */}
                        {/* 내평단 */}
                        {/* <td>{item.totalAmount / item.quantity}</td> */}
                        {/* 보유수량 */}
                        {/* <td>{item.quantity}</td> */}
                        {/* 매수금액 */}
                        {/* <td>{item.totalAmount}</td> */}
                        {/* 평가금액 */}
                        <td>{}</td>
                        {/* 평가손익 */}
                        <td>{}</td>
                        {/* 수익률 */}
                        <td>{}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div>추가하기</div>
            )}
            {isOpenModal && <Modal />}
          </div>
        </>
      ) : (
        <div>로그인해주세요</div>
      )}
    </div>
  );
};

export default PortFolio;
