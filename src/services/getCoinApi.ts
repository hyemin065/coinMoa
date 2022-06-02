import { ICoinMarketParams, ICoinSearchListParams, ICoinOnlyPriceParams } from '../types/coin';
import axios from 'axios';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const getCoinMarketApi = async (params: ICoinMarketParams) => {
  try {
    const res = await axios.get(`${BASE_URL}/coins/markets?`, {
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
    const res = await axios.get(`${BASE_URL}/search?`, {
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
    const res = await axios.get(`${BASE_URL}/simple/price?`, {
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
