import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Eye, Star } from 'lucide-react';
import { useCryptoData } from '../hooks/useCryptoData';
import { SearchInput } from './ui/SearchInput';
import { TableLoadingSkeleton } from './ui/LoadingSkeleton';
import { ErrorMessage } from './ui/ErrorMessage';
import { EmptyState } from './ui/EmptyState';
import type { Coin, SortField, SortOrder } from '../types/crypto'

interface CoinsTableProps {
  onCoinSelect: (coinId: string) => void;
}

export const CoinsTable: React.FC<CoinsTableProps> = ({ onCoinSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: coins, isLoading, error, refetch } = useCryptoData(currentPage);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  const perPage = 50;

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'market_cap_rank' ? 'asc' : 'desc');
    }
  };

  const filteredAndSortedCoins = useMemo(() => {
    if (!coins) return [];

    let filtered = coins;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(query) ||
          coin.symbol.toLowerCase().includes(query)
      );
    }

    // Sort coins
    const sorted = [...filtered].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return sortOrder === 'asc' 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    return sorted;
  }, [coins, searchQuery, sortField, sortOrder]);

  const formatCurrency = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
    }).format(value);
  };

  const formatNumber = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      notation: value > 1e9 ? 'compact' : 'standard',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatPercentage = (value: number | null) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode; align?: 'left' | 'right' }> = ({ 
    field, 
    children,
    align = 'left'
  }) => (
    <button
      onClick={() => handleSort(field)}
      className={`flex items-center space-x-1 hover:text-blue-600 transition-colors ${
        align === 'right' ? 'justify-end' : 'justify-start'
      }`}
    >
      <span>{children}</span>
      <div className="flex flex-col">
        <ChevronUp 
          className={`w-3 h-3 ${
            sortField === field && sortOrder === 'asc' 
              ? 'text-blue-600' 
              : 'text-gray-400'
          }`} 
        />
        <ChevronDown 
          className={`w-3 h-3 -mt-1 ${
            sortField === field && sortOrder === 'desc' 
              ? 'text-blue-600' 
              : 'text-gray-400'
          }`} 
        />
      </div>
    </button>
  );

  const totalMarketCap = coins?.reduce((sum, coin) => sum + (coin.market_cap || 0), 0) || 0;
  const totalVolume = coins?.reduce((sum, coin) => sum + (coin.total_volume || 0), 0) || 0;

  return (
    <section>
      {/* Market Overview */}
      <div className="p-6 mb-6 bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Cryptocurrency Prices by Market Cap</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Highlights</span>
            <div className="relative w-8 h-4 bg-green-500 rounded-full">
              <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5"></div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-4 md:grid-cols-2">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalMarketCap)}
            </div>
            <div className="text-sm text-gray-500">Market Cap +1.2%</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalVolume)}
            </div>
            <div className="text-sm text-gray-500">24h Trading Volume</div>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          The global cryptocurrency market cap today is {formatCurrency(totalMarketCap)}, a 1.2% change in the last 24 hours.{' '}
          <button className="text-blue-600 hover:text-blue-700">Read more</button>
        </p>
      </div>

      {/* Table Controls */}
      <div className="flex flex-col mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center mb-4 space-x-4 sm:mb-0">
          <div className="flex items-center space-x-2 text-sm">
            <button className="px-3 py-1 text-gray-700 transition-colors bg-gray-100 rounded-md hover:bg-gray-200">
              🔥 All
            </button>
            <button className="px-3 py-1 text-gray-600 transition-colors rounded-md hover:bg-gray-100">
              📊 Highlights
            </button>
            <button className="px-3 py-1 text-gray-600 transition-colors rounded-md hover:bg-gray-100">
              📂 Categories
            </button>
            <button className="px-3 py-1 text-gray-600 transition-colors rounded-md hover:bg-gray-100">
              ⚡ Energy
            </button>
            <button className="px-3 py-1 text-gray-600 transition-colors rounded-md hover:bg-gray-100">
              💰 Binance Wallet (30)
            </button>
            <button className="px-3 py-1 text-gray-600 transition-colors rounded-md hover:bg-gray-100">
              🚀 Launchpad
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or symbol..."
            className="w-64"
          />
          <button className="text-gray-600 transition-colors hover:text-gray-800">
            ⚙️ Customize
          </button>
        </div>
      </div>

      {isLoading && <TableLoadingSkeleton />}

      {error && (
        <ErrorMessage
          title="Failed to load cryptocurrencies"
          message="We couldn't fetch the latest market data. Please check your connection and try again."
          onRetry={refetch}
        />
      )}

      {!isLoading && !error && filteredAndSortedCoins.length === 0 && searchQuery && (
        <EmptyState
          title="No cryptocurrencies found"
          message={`No results found for "${searchQuery}". Try adjusting your search terms.`}
        />
      )}

      {!isLoading && !error && filteredAndSortedCoins.length > 0 && (
        <>
          <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      <Star className="w-4 h-4" />
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      <SortButton field="market_cap_rank">#</SortButton>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                      Coin
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      <SortButton field="current_price" align="right">Price</SortButton>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      <SortButton field="price_change_percentage_24h" align="right">1h</SortButton>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      <SortButton field="price_change_percentage_24h" align="right">24h</SortButton>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      7d
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      <SortButton field="total_volume" align="right">24h Volume</SortButton>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                      <SortButton field="market_cap" align="right">Market Cap</SortButton>
                    </th>
                    <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">
                      Last 7 Days
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredAndSortedCoins.map((coin) => (
                    <tr 
                      key={coin.id} 
                      className="transition-colors cursor-pointer hover:bg-gray-50"
                      onClick={() => onCoinSelect(coin.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-gray-400 transition-colors hover:text-yellow-500">
                          <Star className="w-4 h-4" />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {coin.market_cap_rank || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-6 h-6 mr-3 rounded-full"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/24?text=?';
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {coin.name}
                            </div>
                            <div className="text-sm text-gray-500 uppercase">
                              {coin.symbol}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                        {formatCurrency(coin.current_price)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                        <span className="text-gray-500">-</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                        <span className={`font-medium ${
                          (coin.price_change_percentage_24h || 0) >= 0 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }`}>
                          {formatPercentage(coin.price_change_percentage_24h)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right whitespace-nowrap">
                        <span className="text-gray-500">-</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                        {formatNumber(coin.total_volume)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-right text-gray-900 whitespace-nowrap">
                        {formatNumber(coin.market_cap)}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center w-20 h-8 bg-gray-100 rounded">
                          <span className="text-xs text-gray-500">Chart</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} • Showing {filteredAndSortedCoins.length} coins
            </span>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={isLoading || (coins && coins.length < perPage)}
              className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};