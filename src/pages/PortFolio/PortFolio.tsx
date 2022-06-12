import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { bookMarkCoinNameState, coinListState, currencyState, isLoginState, modalState } from '../../recoil/recoil';
import { getPortFolioApi } from '../../services/getCoinApi';
import { IUserCoinList } from '../../types/coin';
import { useUnitCommaData } from '../../utils/useUnitCommaData';
import Modal from '../../components/Modal/Modal';
import ToggleButton from '../../components/Toggle/ToggleButton';
import PortFolioItem from './PortFolioItem/PortFolioItem';

import styles from './portFolio.module.scss';

const MARKET_CATE = ['binance', 'upbit', 'bithumb'];
const CURRENCY_CATE = ['krw', 'usd'];

const PortFolio = () => {
  const [userCoinList, setUserCoinList] = useRecoilState<IUserCoinList[]>(coinListState);
  const setBookMarkCoinName = useSetRecoilState(bookMarkCoinNameState);
  const iscurrency = useRecoilValue(currencyState);
  const isLogin = useRecoilValue(isLoginState);

  const [marketList, setMarketCoinList] = useState<IUserCoinList[]>([]);
  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const [marketValue, setMarketValue] = useState(false);

  const unitComma = useUnitCommaData;
  const list = marketValue ? marketList : userCoinList;

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleBookMarkGetName = (name: any) => {
    setBookMarkCoinName(name);
  };

  const handleShowMarketCoin = (value: string) => {
    const marketCoins = userCoinList.filter((item) => {
      return item.market === value;
    });
    setMarketValue(true);
    setMarketCoinList(marketCoins);
  };

  const getPortFolio = async () => {
    const data = await getPortFolioApi();
    setUserCoinList(data);
  };

  useEffect(() => {
    getPortFolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCurrencyAssets = (value: string) => {
    const currencyItem = userCoinList.filter((item) => item.currency === value);

    const assetsItem = currencyItem.reduce((acc, cur) => {
      const currencyAssets = {
        krw: acc + cur.evaluationAmount,
        usd: acc + cur.evaluationAmount,
      }[value];
      if (!currencyAssets) return 0;
      return currencyAssets;
    }, 0);

    return assetsItem;
  };

  const totalAssets = CURRENCY_CATE.map((item) => getCurrencyAssets(item));

  const handleGetMarketAssets = (marketVal: string) => {
    const market = userCoinList.filter((item) => item.market === marketVal);

    const marketTotalAssets = market.reduce((acc, cur) => {
      const marketAssets = {
        binance: acc + cur.evaluationAmount,
        upbit: acc + cur.evaluationAmount,
        bithumb: acc + cur.evaluationAmount,
      }[marketVal];
      if (!marketAssets) return 0;
      return marketAssets;
    }, 0);
    return marketVal === 'binance'
      ? `${unitComma(false, marketTotalAssets.toFixed(2))}`
      : `${unitComma(true, marketTotalAssets.toFixed(2))}`;
  };

  return (
    <div className={styles.container}>
      {isLogin ? (
        <>
          <ul className={styles.assetsWrap}>
            <li>
              <button type='button' onClick={() => setMarketValue(false)}>
                <h3>총자산</h3>
                <p>
                  {unitComma(iscurrency, iscurrency ? `${totalAssets[1].toFixed(2)}` : `${totalAssets[0].toFixed(2)}`)}
                </p>
              </button>
              <div className={styles.toggle}>
                <ToggleButton />
              </div>
            </li>

            {MARKET_CATE.map((item) => {
              return (
                <li key={Math.random() * 1000}>
                  <button type='button' onClick={() => handleShowMarketCoin(item)}>
                    <span className={styles.marketName}>{item}</span>
                    <h3>{item} 자산</h3>
                    <p>{handleGetMarketAssets(item)}</p>
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
