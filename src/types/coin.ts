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
