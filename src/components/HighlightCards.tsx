import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LoadingSkeleton } from './ui/LoadingSkeleton';
import { ErrorMessage } from './ui/ErrorMessage';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

interface HighlightCardProps {
  title: string;
  coins: Coin[];
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  showMoreLink?: boolean;
  onCoinSelect?: (coinId: string) => void;
}

export const HighlightCard: React.FC<HighlightCardProps> = ({
  title,
  coins,
  isLoading,
  error,
  onRetry,
  showMoreLink = true,
  onCoinSelect,
}) => {
  // Format currency value
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

  // Format percentage value
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
      {/* Card Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {showMoreLink && (
          <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
            more →
          </button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-0">
        {/* Loading State */}
        {isLoading && <LoadingSkeleton rows={5} />}

        {/* Error State */}
        {error && (
          <div className="p-4">
            <ErrorMessage
              title="Failed to load data"
              message="Unable to fetch highlight data."
              onRetry={onRetry}
            />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && coins.length === 0 && (
          <p className="py-8 text-sm text-center text-gray-500">No data available</p>
        )}

        {/* Data State */}
        {!isLoading && !error && coins.length > 0 && (
          <div className="divide-y divide-gray-100">
            {coins.slice(0, 8).map((coin) => (
              <div
                key={coin.id}
                className="flex items-center justify-between px-4 py-3 transition-colors cursor-pointer hover:bg-gray-50"
                onClick={() => onCoinSelect?.(coin.id)}
              >
                {/* Coin Info */}
                <div className="flex items-center flex-1 min-w-0 space-x-3">
                  <img
                    src={coin.image}
                    alt={coin.name}
                    className="flex-shrink-0 w-6 h-6 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/24?text=?';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {coin.name}
                    </p>
                  </div>
                </div>

                {/* Coin Price and Change */}
                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {formatCurrency(coin.current_price)}
                  </p>
                  <p
                    className={`text-xs ${
                      coin.price_change_percentage_24h >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
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
