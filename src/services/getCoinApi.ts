import { IExchangeParams, ICoinMarketParams, ICoinSearchListParams, ICoinOnlyPriceParams } from '../types/coin';

import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const COINMARKETCAP_BASE_URL = 'https://pro-api.coinmarketcap.com';

export const getCoinMarketApi = async (params: ICoinMarketParams) => {
  try {
    const res = await axios.get(`${COINGECKO_BASE_URL}/coins/markets?`, {
      params: {
        order: params.order,
        per_page: params.per_page,
        page: params.page,
        sparkline: params.sparkline,
        vs_currency: params.vs_currency,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getCoinSearchApi = async (params: ICoinSearchListParams) => {
  try {
    const res = await axios.get(`${COINGECKO_BASE_URL}/search?`, {
      params: {
        query: params.query,
      },
    });
    return res.data.coins;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getCoinOnlyPrice = async (params: ICoinOnlyPriceParams) => {
  try {
    const res = await axios.get(`${COINGECKO_BASE_URL}/simple/price?`, {
      params: {
        ids: params.ids,
        vs_currencies: params.vs_currencies,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getExchange = async (params: IExchangeParams) => {
  try {
    const res = await axios.get(`${COINGECKO_BASE_URL}/exchanges`, {
      params: {
        page: params.page,
      },
    });
    return res.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getTrendingCoin = async () => {
  try {
    const res = await axios.get(`${COINGECKO_BASE_URL}/search/trending`);
    return res.data.coins;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getDominanceApi = async () => {
  try {
    const res = await axios.get(`/v1/global-metrics/quotes/latest`, {
      headers: {
        'X-CMC_PRO_API_KEY': `${process.env.REACT_APP_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(res);
    return res.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
