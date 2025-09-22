import axios from 'axios';
import type { Coin, CoinDetails, TrendingResponse } from '../types/crypto';

const BASE_URL = 'https://api.coingecko.com/api/v3';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export const cryptoApi = {
  getCoins: async (page = 1, perPage = 50): Promise<Coin[]> => {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        sparkline: false,
        price_change_percentage: '24h',
      },
    });
    return response.data;
  },

  getCoinDetails: async (coinId: string): Promise<CoinDetails> => {
    const response = await api.get(`/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
        sparkline: false,
      },
    });
    return response.data;
  },

  getTrending: async (): Promise<TrendingResponse> => {
    const response = await api.get('/search/trending');
    return response.data;
  },

  searchCoins: async (query: string): Promise<any> => {
    const response = await api.get('/search', {
      params: { query },
    });
    return response.data;
  },
};