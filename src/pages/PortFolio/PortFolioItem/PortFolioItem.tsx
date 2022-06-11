import { IUserCoinList } from '../../../types/coin';
import { useUnitCommaData } from '../../../utils/useUnitCommaData';
import styles from './portFolioItem.module.scss';

interface IProps {
  item: IUserCoinList;
}

const PortFolioItem = ({ item }: IProps) => {
  const unitComma = useUnitCommaData;
  const coinCurrency = item.currency === 'usd';

  return (
    <tr>
      <td>{item.date}</td>
      <td>{item.market}</td>
      <td>
        <div className={styles.imgBox}>
          <img src={item.thumb} alt={item.name} />
        </div>
        {item.name}
      </td>
      <td>{item.symbol}</td>
      <td>{unitComma(coinCurrency, item.currency === 'usd' ? item.price.usd : item.price.krw)}</td>
      {/* 내평단 */}
      <td>{unitComma(coinCurrency, item.average.toFixed(2))}</td>
      {/* 보유수량 */}
      <td>{item.quantity}</td>
      {/* 매수금액 */}
      <td>{unitComma(coinCurrency, item.totalAmount.toFixed(2))}</td>
      {/* 평가금액 */}
      <td>{unitComma(coinCurrency, item.evaluationAmount.toFixed(2))}</td>
      {/* 평가손익 */}
      <td className={item.valuationPL > 0 ? `${styles.plus}` : `${styles.minus}`}>
        {item.valuationPL > 0
          ? `+${item.valuationPL.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
          : item.valuationPL.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
      </td>
      {/* 수익률 */}
      <td className={item.return > 0 ? `${styles.plus}` : `${styles.minus}`}>{`${item.return}%`}</td>
    </tr>
  );
};

export default PortFolioItem;
