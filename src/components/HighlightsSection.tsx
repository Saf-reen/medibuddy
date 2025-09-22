import React from 'react';
import { useTrendingCoins } from '../hooks/useCryptoData';
import { HighlightCard } from './HighlightCard';

interface HighlightsSectionProps {
  onCoinSelect: (coinId: string) => void;
}

export const HighlightsSection: React.FC<HighlightsSectionProps> = ({ onCoinSelect }) => {
  const { data: trendingData, isLoading, error, refetch } = useTrendingCoins();

  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Crypto Highlights</h2>
        <p className="text-sm text-gray-600">
          Which cryptocurrencies are people most interested in? Track and discover the most interesting cryptocurrencies based on market and CoinGecko activity.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <HighlightCard
          title="🔥 Trending Coins"
          coins={trendingData?.coins.map(({ item }) => ({
            id: item.id,
            symbol: item.symbol,
            name: item.name,
            image: item.large,
            current_price: 0,
            price_change_percentage_24h: 0,
          })) || []}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          onCoinSelect={onCoinSelect}
        />
      </div>
    </section>
  );
};
