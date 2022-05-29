import styles from './portFolio.module.scss';
import upbit from '../../data/upbit.json';

const PortFolio = () => {
  const a = () => {
    upbit.push({
      id: 'eaaaos',
      symbol: 'eos',
      name: 'EOS',
      image: 'https://assets.coingecko.com/coins/images/738/thumb/eos-eos-logo.png?1547034481',
      markets: 'upbit',
      buy_price: 1900,
      current: 'krw',
      buy_date: '2022-04-23',
    });
    console.log(upbit);
  };
  return (
    <div className={styles.container}>
      <button type='button' onClick={a}>
        추가
      </button>
      <div>
        {upbit.map((item) => {
          return <div key={item.id}>{item.name}</div>;
        })}
      </div>
    </div>
  );
};

export default PortFolio;
