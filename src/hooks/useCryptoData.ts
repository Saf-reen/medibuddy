import { useQuery, useQueryClient } from '@tanstack/react-query';
import { cryptoApi } from '../services/api';
import type { Coin, CoinDetails, TrendingResponse } from '../types/crypto';

export const useCryptoData = (page: number = 1, perPage: number = 50) => {
  return useQuery({
    queryKey: ['coins', page, perPage],
    queryFn: () => cryptoApi.getCoins(page, perPage),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });
};

export const useCoinDetails = (coinId: string | null) => {
  return useQuery({
    queryKey: ['coin', coinId],
    queryFn: () => cryptoApi.getCoinDetails(coinId!),
    enabled: !!coinId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTrendingCoins = () => {
  return useQuery({
    queryKey: ['trending'],
    queryFn: cryptoApi.getTrending,
    staleTime: 1000 * 60 * 10, // 10 minutes
    refetchInterval: 1000 * 60 * 15, // 15 minutes
  });
};

export const useInvalidateQueries = () => {
  const queryClient = useQueryClient();
  
  return {
    invalidateCoins: () => queryClient.invalidateQueries({ queryKey: ['coins'] }),
    invalidateTrending: () => queryClient.invalidateQueries({ queryKey: ['trending'] }),
  };
};