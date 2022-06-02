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
  apiCallName: string;
  market: string; // 거래소
  name: string; // 코인이름
  date: string; // 코인 매입 날짜
  currency: string;
  average: number;
  transactionPrice: number; // 매수가 or 매도가
  quantity: number; // 보유수량
  totalAmount: number; // 매수금액
  valuationAmount: number; // 평가금액
}

export interface IUserCoinUpdate {
  userId: string;
  apiCallName: string;
  market: string;
  name: string;
  date: string;
  average: string;
  currency: string;
  transactionPrice: number;
  transaction: string;
  quantity: number;
}

export interface ISearchCoin {
  id: string;
  large: string;
  market_cap_rank: number;
  name: string;
  symbol: string;
  thumb: string;
}
