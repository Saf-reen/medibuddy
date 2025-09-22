import React from 'react';
import { TrendingUp, TrendingDown, Volume2, Star, Trophy } from 'lucide-react';
import { useCryptoData, useTrendingCoins } from '../hooks/useCryptoData';
import { LoadingSkeleton } from './ui/LoadingSkeleton';
import { ErrorMessage } from './ui/ErrorMessage';
import type { Coin } from '../types/crypto';

interface HighlightCardProps {
  title: string;
  icon: React.ReactNode;
  coins: Coin[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  colorClass?: string;
}

const HighlightCard: React.FC<HighlightCardProps> = ({
  title,
  icon,
  coins,
  isLoading,
  error,
  onRetry,
  colorClass = 'bg-blue-500',
}) => {
  const formatCurrency = (value: number) => {
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
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className={`${colorClass} text-white p-4`}>
        <div className="flex items-center space-x-2">
          {icon}
          <h3 className="font-semibold">{title}</h3>
        </div>
      </div>
      
      <div className="p-4">
        {isLoading && <LoadingSkeleton rows={3} />}
        
        {error && (
          <ErrorMessage
            title="Failed to load data"
            message="Unable to fetch highlight data."
            onRetry={onRetry}
          />
        )}
        
        {!isLoading && !error && coins.length === 0 && (
          <p className="text-gray-500 text-center py-4">No data available</p>
        )}
        
        {!isLoading && !error && coins.length > 0 && (
          <div className="space-y-3">
            {coins.slice(0, 5).map((coin, index) => (
              <div key={coin.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-500 w-4">
                    #{index + 1}
                  </span>
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="w-8 h-8 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/32?text=?';
                    }}
                  />
                  <div>
                    <p className="font-medium text-gray-900 truncate">
                      {coin.name}
                    </p>
                    <p className="text-sm text-gray-500 uppercase">
                      {coin.symbol}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(coin.current_price)}
                  </p>
                  <p className={`text-sm ${
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

export const HighlightsSection: React.FC = () => {
  const { data: coins, isLoading, error, refetch } = useCryptoData(1, 100);
  const { data: trendingData, isLoading: trendingLoading, error: trendingError, refetch: refetchTrending } = useTrendingCoins();

  // Process data for different highlights
  const topGainers = coins ? [...coins]
    .filter(coin => coin.price_change_percentage_24h > 0)
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h) : [];

  const topLosers = coins ? [...coins]
    .filter(coin => coin.price_change_percentage_24h < 0)
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h) : [];

  const highestVolume = coins ? [...coins]
    .sort((a, b) => b.total_volume - a.total_volume) : [];

  const topPerformers7d = coins ? [...coins]
    .sort((a, b) => b.market_cap - a.market_cap)
    .slice(0, 10) : [];

  // Convert trending coins to regular coin format for display
  const trendingCoins = trendingData ? trendingData.coins.map(({ item }) => ({
    id: item.id,
    symbol: item.symbol,
    name: item.name,
    image: item.large,
    current_price: 0, // Price not available in trending API
    market_cap: 0,
    market_cap_rank: item.market_cap_rank,
    total_volume: 0,
    price_change_percentage_24h: 0,
    // Other required fields with default values
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

  return (
    <section className="mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Star className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-900">Market Highlights</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <HighlightCard
          title="Top Gainers (24h)"
          icon={<TrendingUp className="w-5 h-5" />}
          coins={topGainers}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          colorClass="bg-green-500"
        />
        
        <HighlightCard
          title="Top Losers (24h)"
          icon={<TrendingDown className="w-5 h-5" />}
          coins={topLosers}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          colorClass="bg-red-500"
        />
        
        <HighlightCard
          title="Highest Volume"
          icon={<Volume2 className="w-5 h-5" />}
          coins={highestVolume}
          isLoading={isLoading}
          error={error}
          onRetry={refetch}
          colorClass="bg-purple-500"
        />
        
        <HighlightCard
          title="Trending"
          icon={<Trophy className="w-5 h-5" />}
          coins={trendingCoins}
          isLoading={trendingLoading}
          error={trendingError}
          onRetry={refetchTrending}
          colorClass="bg-orange-500"
        />
      </div>
    </section>
  );
};