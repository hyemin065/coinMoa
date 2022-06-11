import { IUserCoinList } from '../../../types/coin';
import styles from './portFolioItem.module.scss';

interface IProps {
  item: IUserCoinList;
}

const PortFolioItem = ({ item }: IProps) => {
  const coinCurrency = item.currency === 'krw' ? '₩' : '$';
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
      <td>
        {coinCurrency}
        {item.price.krw}
      </td>
      {/* 내평단 */}
      <td>
        {coinCurrency}
        {item.average}
      </td>
      {/* 보유수량 */}
      <td>{item.quantity}</td>
      {/* 매수금액 */}
      <td>
        {coinCurrency}
        {item.totalAmount}
      </td>
      {/* 평가금액 */}
      <td>
        {coinCurrency}
        {item.evaluationAmount}
      </td>
      {/* 평가손익 */}
      <td className={item.valuationPL > 0 ? `${styles.plus}` : `${styles.minus}`}>
        {item.valuationPL > 0 ? `+${item.valuationPL.toFixed(2)}` : item.valuationPL.toFixed(2)}
      </td>
      {/* 수익률 */}
      <td className={item.return > 0 ? `${styles.plus}` : `${styles.minus}`}>{`${item.return}%`}</td>
    </tr>
  );
};

export default PortFolioItem;
