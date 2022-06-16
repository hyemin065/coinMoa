import { useRecoilValue } from 'recoil';

import { coinListState, currencyState } from '../../../recoil/recoil';
import { IUserCoinList } from '../../../types/coin';
import { useUnitCommaData } from '../../../utils/useUnitCommaData';
import ToggleButton from '../../../components/Toggle/ToggleButton';

import styles from './portFolioAssets.module.scss';

interface IProps {
  setMarketValue: (value: boolean) => void;
  setMarketCoinList: (value: IUserCoinList[]) => void;
}

const MARKET_CATE = ['binance', 'upbit', 'bithumb'];
const CURRENCY_CATE = ['krw', 'usd'];

const PortFolioAssets = ({ setMarketValue, setMarketCoinList }: IProps) => {
  const userCoinList = useRecoilValue<IUserCoinList[]>(coinListState);
  const iscurrency = useRecoilValue(currencyState);

  const unitComma = useUnitCommaData;

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

  const handleShowMarketCoin = (value: string) => {
    const marketCoins = userCoinList.filter((item) => {
      return item.market === value;
    });
    setMarketValue(true);
    setMarketCoinList(marketCoins);
  };

  return (
    <ul className={styles.assetsWrap}>
      <li>
        <button type='button' onClick={() => setMarketValue(false)}>
          <h3>총자산</h3>
          <p>{unitComma(iscurrency, iscurrency ? `${totalAssets[1].toFixed(2)}` : `${totalAssets[0].toFixed(2)}`)}</p>
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
  );
};

export default PortFolioAssets;
