import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TrendingUp, RefreshCw } from 'lucide-react';
import { HighlightsSection } from './components/HighlightsSection';
import { CoinsTable } from './components/CoinsTable';
import { CoinModal } from './components/CoinModal';
import { useInvalidateQueries } from './hooks/useCryptoData';
import { TabNavigation } from './components/TabNavigation';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const tabs = [
  { id: 'all', label: 'All', icon: <span>🔥</span> },
  { id: 'highlights', label: 'Highlights', icon: <span>📊</span> },
  { id: 'categories', label: 'Categories', icon: <span>📂</span> },
  { id: 'energy', label: 'Energy', icon: <span>⚡</span> },
  { id: 'binance', label: 'Binance Wallet', icon: <span>💰</span> },
  { id: 'launchpad', label: 'Launchpad', icon: <span>🚀</span> },
];

const DashboardContent: React.FC = () => {
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
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
    await Promise.all([invalidateCoins(), invalidateTrending()]);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-green-400 to-blue-500">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CoinGecko</h1>
                <p className="text-sm text-gray-500">Cryptocurrency Prices & Market Data</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <nav className="items-center hidden space-x-6 md:flex">
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Cryptocurrencies</a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Exchanges</a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">NFT</a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Learn</a>
                <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-900">Products</a>
              </nav>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center px-3 py-2 space-x-2 text-sm text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'all' && <CoinsTable onCoinSelect={handleCoinSelect} />}
        {activeTab === 'highlights' && <HighlightsSection onCoinSelect={handleCoinSelect} />}
        {/* Add other tab pages here */}
      </main>

      {/* Coin Details Modal */}
      <CoinModal
        coinId={selectedCoinId}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-gray-200">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-4 text-center">
            <p className="text-gray-600">
              Data provided by{' '}
              <a
                href="https://www.coingecko.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-green-600 hover:text-green-700"
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
