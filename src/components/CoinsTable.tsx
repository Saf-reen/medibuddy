import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Eye } from 'lucide-react';
import { useCryptoData } from '../hooks/useCryptoData';
import { SearchInput } from './ui/SearchInput';
import { TableLoadingSkeleton } from './ui/LoadingSkeleton';
import { ErrorMessage } from './ui/ErrorMessage';
import { EmptyState } from './ui/EmptyState';
import type { Coin, SortField, SortOrder } from '../types/crypto';

interface CoinsTableProps {
  onCoinSelect: (coinId: string) => void;
}

export const CoinsTable: React.FC<CoinsTableProps> = ({ onCoinSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<SortField>('market_cap_rank');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  const perPage = 50;
  const { data: coins, isLoading, error, refetch } = useCryptoData(currentPage, perPage);

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

  const SortButton: React.FC<{ field: SortField; children: React.ReactNode }> = ({ 
    field, 
    children 
  }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left hover:text-blue-600 transition-colors"
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

  return (
    <section>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">All Cryptocurrencies</h2>
        <div className="flex items-center space-x-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or symbol..."
            className="w-64"
          />
          <div className="text-sm text-gray-500">
            Page {currentPage} • {filteredAndSortedCoins.length} coins
          </div>
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
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <SortButton field="market_cap_rank">Rank</SortButton>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex justify-end">
                        <SortButton field="current_price">Price</SortButton>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex justify-end">
                        <SortButton field="price_change_percentage_24h">24h Change</SortButton>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex justify-end">
                        <SortButton field="market_cap">Market Cap</SortButton>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <div className="flex justify-end">
                        <SortButton field="total_volume">Volume (24h)</SortButton>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedCoins.map((coin) => (
                    <tr 
                      key={coin.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => onCoinSelect(coin.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {coin.market_cap_rank || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-8 h-8 rounded-full mr-3"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = 'https://via.placeholder.com/32?text=?';
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
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {formatCurrency(coin.current_price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="flex flex-col items-end">
                          <span className={`font-medium ${
                            (coin.price_change_percentage_24h || 0) >= 0 
                              ? 'text-green-600' 
                              : 'text-red-600'
                          }`}>
                            {formatPercentage(coin.price_change_percentage_24h)}
                          </span>
                          <span className={`text-xs ${
                            (coin.price_change_24h || 0) >= 0 
                              ? 'text-green-500' 
                              : 'text-red-500'
                          }`}>
                            {formatCurrency(coin.price_change_24h)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {formatNumber(coin.market_cap)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                        {formatNumber(coin.total_volume)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCoinSelect(coin.id);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage}
            </span>
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={isLoading || (coins && coins.length < perPage)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
};