export interface ICoinMarketParams {
  order: string;
  per_page: number;
  page: number;
  sparkline: boolean;
  vs_currency: string;
}

export interface ICoinSearchListParams {
  query: string;
}

export interface ICoinOnlyPriceParams {
  ids: string;
  vs_currencies: string;
}

export interface IMarketCoin {
  market_cap_rank: number | null;
  id: string;
  name: string;
  symbol: string;
  image: string;
  market_cap: number | null;
  current_price: number | null;
  price_change_percentage_24h: number | null;
  total_volume: number | null;
  high_24h: number | null;
  low_24h: number | null;
}

export interface IUserCoinList {
  id: string;
  userId: string;
  apiCallName: string;
  market: string;
  name: string;
  symbol: string;
  thumb: string;
  currency: string;
  transaction: string;
  date: string;
  price: IPrice;
  transactionPrice: number;
  average: number;
  quantity: number;
  totalAmount: number;
  evaluationAmount: number;
  valuationPL: number;
  return: number;
}

export interface ISearchCoin {
  id: string;
  large: string;
  market_cap_rank: number;
  name: string;
  symbol: string;
  thumb: string;
}

export interface IPrice {
  krw: number;
  usd: number;
}

export interface IExchange {
  country: string | null;
  has_trading_incentive: boolean;
  id: string;
  image: string;
  name: number;
  trade_volume_24h_btc: number;
  trust_score: number | null;
  trust_score_rank: number;
  url: string;
}

export interface IExchangeParams {
  page: number;
}

export interface ITrendCoinArray {
  item: ITrendCoin;
}

export interface ITrendCoin {
  coin_id: number;
  id: string;
  name: string;
  market_cap_rank: number;
  score: number;
  slug: string;
  symbol: string;
  thumb: string;
}

export interface IDominance {
  eth_dominance: number;
  btc_dominance: number;
  eth_dominance_24h_percentage_change: number;
  btc_dominance_24h_percentage_change: number;
  defi_volume_24h: number;
  defi_market_cap: number;
  defi_24h_percentage_change: number;
  stablecoin_volume_24h: number;
  stablecoin_market_cap: number;
  stablecoin_24h_percentage_change: number;
  derivatives_volume_24h: number;
  derivatives_24h_percentage_change: number;
}

export interface ICoin {
  portFolioCoin: IUserCoinList[];
  uniqueId: string | null;
  searchValueId: string;
  marketValue: string;
  searchValueName: string;
  searchValueSymbol: string;
  searchValueThumb: string;
  selectCurrency: string;
  date: string;
  transaction: string;
  transactionPrice: number;
  quantity: number;
}
