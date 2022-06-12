import { useRecoilValue } from 'recoil';
import { useUnitCommaData } from '../../../utils/useUnitCommaData';
import { coinListState } from '../../../recoil/recoil';
import { IMarketCoin, IUserCoinList } from '../../../types/coin';
import { StarActiveIcon, StarIcon } from '../../../assets';

import styles from './marketItem.module.scss';

interface IProps {
  item: IMarketCoin;
  currency: boolean;
  handleOpenModal: () => void;
  handleBookMarkGetName: (name: string) => void;
}
const MarketItem = ({ currency, item, handleOpenModal, handleBookMarkGetName }: IProps) => {
  const bookMarkCoin = useRecoilValue<IUserCoinList[]>(coinListState);
  const currentPrice = useUnitCommaData(currency, item.current_price !== null ? item.current_price : 0);

  const highPrice = useUnitCommaData(currency, item.high_24h !== null ? item.high_24h : 0);
  const lowPrice = useUnitCommaData(currency, item.low_24h !== null ? item.low_24h : 0);
  const totalVolume = useUnitCommaData(currency, item.total_volume !== null ? item.total_volume : 0);
  const marketCap = useUnitCommaData(currency, item.market_cap !== null ? item.market_cap : 0);

  const bookMarkList = bookMarkCoin.map((items) => items.name);
  const bookMarkActive = bookMarkList.includes(item.name);
  return (
    <tr>
      <td className={styles.bookmark}>
        <button
          type='button'
          onClick={() => {
            handleOpenModal();
            handleBookMarkGetName(item.id);
          }}
        >
          {bookMarkActive ? <StarActiveIcon /> : <StarIcon />}
        </button>
      </td>
      <td className={styles.rank}>{item.market_cap_rank}</td>
      <td>
        <dl>
          <dt>
            <img src={item.image} alt={item.name} />
          </dt>
          <dd>{item.name}</dd>
        </dl>
      </td>
      <td className={styles.symbol}>{item.symbol}</td>
      <td>{currentPrice}</td>
      <td>{highPrice}</td>
      <td>{lowPrice}</td>
      <td
        className={
          item.price_change_percentage_24h !== null && item.price_change_percentage_24h > 0
            ? `${styles.plus}`
            : `${styles.minus}`
        }
      >
        {item.price_change_percentage_24h !== null ? `${item.price_change_percentage_24h}%` : '-'}
      </td>
      <td>{totalVolume}</td>
      <td>{marketCap}</td>
    </tr>
  );
};

export default MarketItem;
