import React from 'react';
import { TrendingUp, TrendingDown, Volume2, Star, Trophy, Eye } from 'lucide-react';
import { useCryptoData, useTrendingCoins } from '../hooks/useCryptoData';
import { LoadingSkeleton } from './ui/LoadingSkeleton';
import { ErrorMessage } from './ui/ErrorMessage';
import type { Coin } from '../types/crypto';

interface HighlightCardProps {
  title: string;
  coins: Coin[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  showMoreLink?: boolean;
  onCoinSelect?: (coinId: string) => void;
}

const HighlightCard: React.FC<HighlightCardProps> = ({
  title,
  coins,
  isLoading,
  error,
  onRetry,
  showMoreLink = true,
  onCoinSelect,
}) => {
  const formatCurrency = (value: number) => {
    if (value < 0.01) {
      return `$${value.toFixed(6)}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
        {showMoreLink && (
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            more →
          </button>
        )}
      </div>
      
      <div className="p-0">
        {isLoading && <LoadingSkeleton rows={5} />}
        
        {error && (
          <div className="p-4">
            <ErrorMessage
              title="Failed to load data"
              message="Unable to fetch highlight data."
              onRetry={onRetry}
            />
          </div>
        )}
        
        {!isLoading && !error && coins.length === 0 && (
          <p className="text-gray-500 text-center py-8 text-sm">No data available</p>
        )}
        
        {!isLoading && !error && coins.length > 0 && (
          <div className="divide-y divide-gray-100">
            {coins.slice(0, 8).map((coin, index) => (
              <div 
                key={coin.id} 
                className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between"
                onClick={() => onCoinSelect?.(coin.id)}
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-6 h-6 rounded-full flex-shrink-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/24?text=?';
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm truncate">
                      {coin.name}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-medium text-gray-900 text-sm">
                    {formatCurrency(coin.current_price)}
                  </p>
                  <p className={`text-xs ${
                    coin.price_change_percentage_24h >= 0 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface HighlightsSectionProps {
  onCoinSelect: (coinId: string) => void;
}

export const HighlightsSection: React.FC<HighlightsSectionProps> = ({ onCoinSelect }) => {
  const { data: coins, isLoading, error, refetch } = useCryptoData(1, 100);
  const { data: trendingData, isLoading: trendingLoading, error: trendingError, refetch: refetchTrending } = useTrendingCoins();

  // Process data for different highlights
  const trendingCoins = trendingData ? trendingData.coins.map(({ item }) => ({
    id: item.id,
    symbol: item.symbol,
    name: item.name,
    image: item.large,
    current_price: 0,
    market_cap: 0,
    market_cap_rank: item.market_cap_rank,
    total_volume: 0,
    price_change_percentage_24h: 0,
    fully_diluted_valuation: 0,
    high_24h: 0,
    low_24h: 0,
    price_change_24h: 0,
    market_cap_change_24h: 0,
    market_cap_change_percentage_24h: 0,
    circulating_supply: 0,
    total_supply: 0,
    max_supply: 0,
    ath: 0,
    ath_change_percentage: 0,
    ath_date: '',
    atl: 0,
    atl_change_percentage: 0,
    atl_date: '',
    roi: null,
    last_updated: '',
  })) : [];

  const topGainers = coins ? [...coins]
    .filter(coin => coin.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h) : [];

  const topLosers = coins ? [...coins]
    .filter(coin => coin.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h) : [];

  const newCoins = coins ? [...coins]
    .filter(coin => coin.market_cap_rank && coin.market_cap_rank > 500)
    .sort((a, b) => (a.market_cap_rank || 0) - (b.market_cap_rank || 0)) : [];

  const incomingTokenUnlocks = coins ? [...coins]
    .sort((a, b) => b.total_volume - a.total_volume)
    .slice(0, 8) : [];

  const mostViewed = coins ? [...coins]
    .sort((a, b) => b.market_cap - a.market_cap)
    .slice(0, 8) : [];

  return (
    <section className="mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Crypto Highlights</h2>
        <p className="text-gray-600 text-sm">
          Which cryptocurrencies are people most interested in? Track and discover the most interesting cryptocurrencies based on market and CoinGecko activity.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <HighlightCard
          title="🔥 Trending Coins"
          coins={trendingCoins}
          isLoading={trendingLoading}
          error={trendingError}
          onRetry={refetchTrending}
          onCoinSelect={onCoinSelect}
        />
        
        <HighlightCard
          title="🚀 Top Gainers"
          coins={topGainers}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          onCoinSelect={onCoinSelect}
        />
        
        <HighlightCard
          title="📉 Top Losers"
          coins={topLosers}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          onCoinSelect={onCoinSelect}
        />
        
        <HighlightCard
          title="🆕 New Coins"
          coins={newCoins}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          onCoinSelect={onCoinSelect}
        />
        
        <HighlightCard
          title="🔓 Incoming Token Unlocks"
          coins={incomingTokenUnlocks}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          onCoinSelect={onCoinSelect}
        />
        
        <HighlightCard
          title="👁️ Most Viewed"
          coins={mostViewed}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          onCoinSelect={onCoinSelect}
        />
      </div>
    </section>
  );
};