import React from 'react';
import { X, ExternalLink, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useCoinDetails } from '../hooks/useCryptoData';
import { LoadingSkeleton } from './ui/LoadingSkeleton';
import { ErrorMessage } from './ui/ErrorMessage';

interface CoinModalProps {
  coinId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CoinModal: React.FC<CoinModalProps> = ({ coinId, isOpen, onClose }) => {
  const { data: coin, isLoading, error, refetch } = useCoinDetails(coinId);

  if (!isOpen) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Coin Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {isLoading && (
              <LoadingSkeleton rows={5} className="space-y-6" />
            )}

            {error && (
              <ErrorMessage
                title="Failed to load coin details"
                message="We couldn't fetch the details for this coin. Please try again."
                onRetry={() => refetch()}
              />
            )}

            {coin && (
              <div className="space-y-8">
                {/* Basic Info */}
                <div className="flex items-center space-x-4">
                  <img
                    src={coin.image.large}
                    alt={coin.name}
                    className="w-16 h-16 rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/64?text=?';
                    }}
                  />
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">{coin.name}</h3>
                    <p className="text-lg text-gray-600 uppercase">{coin.symbol}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        Rank #{coin.market_cap_rank}
                      </span>
                      {coin.market_data.current_price.usd && (
                        <span className="text-2xl font-bold text-gray-900">
                          {formatCurrency(coin.market_data.current_price.usd)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Price Changes */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '24h Change', value: coin.market_data.price_change_percentage_24h },
                    { label: '7d Change', value: coin.market_data.price_change_percentage_7d },
                    { label: '30d Change', value: coin.market_data.price_change_percentage_30d },
                    { label: '1y Change', value: coin.market_data.price_change_percentage_1y },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">{label}</p>
                      <div className="flex items-center space-x-1">
                        {value > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`font-semibold ${
                          value >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {formatPercentage(value)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Market Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Market Statistics</h4>
                    <div className="space-y-3">
                      {[
                        { 
                          label: 'Market Cap', 
                          value: coin.market_data.market_cap.usd ? formatCurrency(coin.market_data.market_cap.usd) : 'N/A'
                        },
                        { 
                          label: '24h Volume', 
                          value: coin.market_data.total_volume.usd ? formatCurrency(coin.market_data.total_volume.usd) : 'N/A'
                        },
                        { 
                          label: 'Circulating Supply', 
                          value: coin.market_data.circulating_supply ? `${formatNumber(coin.market_data.circulating_supply)} ${coin.symbol.toUpperCase()}` : 'N/A'
                        },
                        { 
                          label: 'Total Supply', 
                          value: coin.market_data.total_supply ? `${formatNumber(coin.market_data.total_supply)} ${coin.symbol.toUpperCase()}` : 'N/A'
                        },
                        { 
                          label: 'Max Supply', 
                          value: coin.market_data.max_supply ? `${formatNumber(coin.market_data.max_supply)} ${coin.symbol.toUpperCase()}` : 'Unlimited'
                        },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-gray-600">{label}:</span>
                          <span className="font-medium text-gray-900">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">All-Time Records</h4>
                    <div className="space-y-3">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-green-800 font-medium">All-Time High</span>
                          <span className="text-green-600 font-bold">
                            {formatCurrency(coin.market_data.ath.usd)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-green-600">
                            {formatPercentage(coin.market_data.ath_change_percentage.usd)}
                          </span>
                          <div className="flex items-center text-green-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{new Date(coin.market_data.ath_date.usd).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-red-800 font-medium">All-Time Low</span>
                          <span className="text-red-600 font-bold">
                            {formatCurrency(coin.market_data.atl.usd)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-red-600">
                            {formatPercentage(coin.market_data.atl_change_percentage.usd)}
                          </span>
                          <div className="flex items-center text-red-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{new Date(coin.market_data.atl_date.usd).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {coin.description.en && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">About {coin.name}</h4>
                    <div 
                      className="text-gray-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: coin.description.en.split('. ')[0] + '.'
                      }}
                    />
                  </div>
                )}

                {/* Links */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Links</h4>
                  <div className="flex flex-wrap gap-2">
                    {coin.links.homepage[0] && (
                      <a
                        href={coin.links.homepage[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Website</span>
                      </a>
                    )}
                    {coin.links.blockchain_site.filter(Boolean).slice(0, 2).map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Explorer</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};