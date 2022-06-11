import {
  IUserCoinList,
  IExchangeParams,
  ICoinMarketParams,
  ICoinSearchListParams,
  ICoinOnlyPriceParams,
} from '../types/coin';

import axios from 'axios';

const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';

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
    return res.data.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const getPortFolioApi = async () => {
  const uniqueId = localStorage.getItem('id');

  try {
    const res = await axios.get(`https://coin-moa.herokuapp.com/coin/getCoin/${uniqueId}`);
    const { coin } = res.data;
    const coinName = coin.map((item: IUserCoinList) => item.apiCallName).join(',');

    const coinPrice = await getCoinOnlyPrice({
      ids: coinName,
      vs_currencies: 'krw,usd',
    });

    const coinList = coin.map((item: IUserCoinList) => {
      const name = item.apiCallName;
      const price = coinPrice[name];
      const presentPrice = price[item.currency];

      return {
        ...item,
        price,
        totalAmount: item.currency === 'krw' ? `₩${item.average * item.quantity}` : `$${item.average * item.quantity}`,
        evaluationAmount:
          item.currency === 'krw' ? `₩${presentPrice * item.quantity}` : `$${presentPrice * item.quantity}`,
        valuationPL: presentPrice * item.quantity - item.average * item.quantity,
        return: (((presentPrice - item.average) / item.average) * 100).toFixed(2),
      };
    });

    return coinList;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const addCoinApi = async (
  uniqueId: string | null,
  searchValueId: string,
  marketValue: string,
  searchValueName: string,
  searchValueSymbol: string,
  searchValueThumb: string,
  selectCurrency: string,
  transaction: string,
  date: string,
  transactionPrice: number,
  quantity: number
) => {
  try {
    await axios.post('https://coin-moa.herokuapp.com/coin/coinAdd', {
      userId: uniqueId,
      apiCallName: searchValueId,
      market: marketValue,
      name: searchValueName,
      symbol: searchValueSymbol,
      thumb: searchValueThumb,
      currency: selectCurrency,
      transaction,
      date,
      transactionPrice,
      average: Number(transactionPrice),
      quantity,
      totalAmount: Number(transactionPrice) * quantity,
    });
    return;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const deleteCoinApi = async (uniqueId: string | null, searchValueId: string, marketValue: string) => {
  try {
    await axios.post('https://coin-moa.herokuapp.com/coin/delete', {
      userId: uniqueId,
      apiCallName: searchValueId,
      market: marketValue,
    });
    return;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const updateCoinApi = async (
  portFolioCoin: IUserCoinList[],
  uniqueId: string | null,
  searchValueId: string,
  marketValue: string,
  searchValueName: string,
  searchValueSymbol: string,
  searchValueThumb: string,
  selectCurrency: string,
  date: string,
  transaction: string,
  transactionPrice: number,
  quantity: number
) => {
  try {
    await axios.post('https://coin-moa.herokuapp.com/coin/update', {
      userId: uniqueId,
      apiCallName: searchValueId,
      market: marketValue,
      name: searchValueName,
      symbol: searchValueSymbol,
      thumb: searchValueThumb,
      currency: selectCurrency,
      date,
      transaction,
      transactionPrice,
      average:
        transaction === 'buy'
          ? portFolioCoin[0].average + Number(transactionPrice)
          : portFolioCoin[0].average - Number(transactionPrice),
      quantity:
        transaction === 'buy'
          ? portFolioCoin[0].quantity + Number(quantity)
          : portFolioCoin[0].quantity - Number(quantity),
      totalAmount:
        transaction === 'buy'
          ? portFolioCoin[0].totalAmount + Number(transactionPrice) * Number(quantity)
          : portFolioCoin[0].totalAmount - Number(transactionPrice) * Number(quantity),
    });
    return;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
