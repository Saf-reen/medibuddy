import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { cryptoApi } from '../services/api';
import { CoinsTable } from '../components/CoinsTable';

interface AllCoinsPageProps {
  onCoinSelect: (coinId: string) => void;
}

export const AllCoinsPage: React.FC<AllCoinsPageProps> = ({ onCoinSelect }) => {
  const { data: coins, isLoading, error } = useQuery({
    queryKey: ['coins'],
    queryFn: () => cryptoApi.getCoins(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return <CoinsTable coins={coins} onCoinSelect={onCoinSelect} />;
};
