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

export interface ICoin {
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
