import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { HighlightsSection } from './components/HighlightsSection';
import { CoinsTable } from './components/CoinsTable';
import { CoinModal } from './components/CoinModal';
import { useInvalidateQueries } from './hooks/useCryptoData';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const DashboardContent: React.FC = () => {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { invalidateCoins, invalidateTrending } = useInvalidateQueries();

  const handleCoinSelect = (coinId: string) => {
    setSelectedCoinId(coinId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCoinId(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      invalidateCoins(),
      invalidateTrending(),
    ]);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CoinGecko</h1>
                <p className="text-sm text-gray-500">Cryptocurrency Prices & Market Data</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Cryptocurrencies</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Exchanges</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">NFT</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Learn</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Products</a>
              </nav>
              
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HighlightsSection onCoinSelect={handleCoinSelect} />
        <CoinsTable onCoinSelect={handleCoinSelect} />
      </main>

      {/* Coin Details Modal */}
      <CoinModal
        coinId={selectedCoinId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Data provided by{' '}
              <a
                href="https://www.coingecko.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-700 font-medium"
              >
                CoinGecko API
              </a>
            </p>
            <p className="text-sm text-gray-500">
              Real-time cryptocurrency market data • Updates every 5 minutes
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>Built with React & TypeScript</span>
              <span>•</span>
              <span>Powered by TanStack Query</span>
              <span>•</span>
              <span>Styled with Tailwind CSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DashboardContent />
    </QueryClientProvider>
  );
}

export default App;