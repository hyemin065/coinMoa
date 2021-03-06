import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import { bookMarkCoinNameState, coinListState, isLoginState, modalState } from '../../recoil/recoil';
import { getPortFolioApi } from '../../services/getCoinApi';
import { IUserCoinList } from '../../types/coin';
import Modal from '../../components/Modal/Modal';
import PortFolioItem from './PortFolioItem/PortFolioItem';
import PortFolioAssets from './PortFolioAssets/PortFolioAssets';

import styles from './portFolio.module.scss';
import Loading from '../../assets/loading.gif';

const PortFolio = () => {
  const [userCoinList, setUserCoinList] = useRecoilState<IUserCoinList[]>(coinListState);
  const setBookMarkCoinName = useSetRecoilState(bookMarkCoinNameState);
  const isLogin = useRecoilValue(isLoginState);

  const [marketList, setMarketCoinList] = useState<IUserCoinList[]>([]);
  const [isOpenModal, setIsOpenModal] = useRecoilState(modalState);
  const [marketValue, setMarketValue] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const list = marketValue ? marketList : userCoinList;

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  const handleBookMarkGetName = (name: any) => {
    setBookMarkCoinName(name);
  };

  const getPortFolio = async () => {
    const data = await getPortFolioApi();
    if (data.length > 0) {
      setUserCoinList(data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPortFolio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.container}>
      {!isLoading ? (
        <div>
          {isLogin ? (
            <section className={styles.portFolioWrap}>
              {list.length > 0 ? (
                <>
                  <PortFolioAssets setMarketValue={setMarketValue} setMarketCoinList={setMarketCoinList} />
                  <div className={styles.addBtn}>
                    <button
                      type='button'
                      onClick={() => {
                        handleOpenModal();
                        handleBookMarkGetName('');
                      }}
                    >
                      ????????????
                    </button>
                  </div>
                  <table className={styles.portFolioTable}>
                    <thead>
                      <tr>
                        <th>?????????</th>
                        <th>?????????</th>
                        <th colSpan={2}>??????</th>
                        <th>?????????</th>
                        <th>??????</th>
                        <th>??????</th>
                        <th>????????????</th>
                        <th>????????????</th>
                        <th>????????????</th>
                        <th>?????????</th>
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
                    ????????????
                  </button>
                </div>
              )}
            </section>
          ) : (
            <article className={styles.goLogin}>
              <p>????????? ??? ???????????? ??? ????????????</p>
              <Link to='/signin'>?????????</Link>
            </article>
          )}
          {isOpenModal && <Modal />}
        </div>
      ) : (
        <div className={styles.loadingWrap}>
          <img src={Loading} alt='loading' />
        </div>
      )}
    </div>
  );
};

export default PortFolio;
