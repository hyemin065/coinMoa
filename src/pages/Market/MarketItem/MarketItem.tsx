import { useSetRecoilState } from 'recoil';
import { StarIcon } from '../../../assets';
import { useUnitCommaData } from '../../../hooks/useUnitCommaData';
import { modalState } from '../../../recoil/recoil';
import { ICoin } from '../../../types/coin';
import styles from './marketItem.module.scss';

interface IProps {
  item: ICoin;
  current: boolean;
}
const MarketItem = ({ current, item }: IProps) => {
  const setIsOpenModal = useSetRecoilState(modalState);
  const currentPrice = useUnitCommaData(current, item.current_price !== null ? item.current_price : 0);
  const highPrice = useUnitCommaData(current, item.high_24h !== null ? item.high_24h : 0);
  const lowPrice = useUnitCommaData(current, item.low_24h !== null ? item.low_24h : 0);
  const totalVolume = useUnitCommaData(current, item.total_volume !== null ? item.total_volume : 0);
  const marketCap = useUnitCommaData(current, item.market_cap !== null ? item.market_cap : 0);

  const handleOpenModal = () => {
    setIsOpenModal(true);
  };

  return (
    <tr>
      <td className={styles.bookMark}>
        <button type='button' onClick={handleOpenModal}>
          <StarIcon />
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
      <td>{currentPrice !== '0' ? `${currentPrice}` : '-'}</td>
      <td>{highPrice !== '0' ? `${highPrice}` : '-'}</td>
      <td>{lowPrice !== '0' ? `${lowPrice}` : '-'}</td>
      <td
        className={
          item.price_change_percentage_24h !== null && item.price_change_percentage_24h > 0
            ? `${styles.plus}`
            : `${styles.minus}`
        }
      >
        {item.price_change_percentage_24h !== null ? `${item.price_change_percentage_24h}%` : '-'}
      </td>
      <td>{totalVolume !== '0' ? `${totalVolume}` : '-'}</td>
      <td>{marketCap !== '0' ? `${marketCap}` : '-'}</td>
    </tr>
  );
};

export default MarketItem;
