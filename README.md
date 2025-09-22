# CryptoDash - Cryptocurrency Market Dashboard

A modern, production-ready cryptocurrency dashboard built with React, TypeScript, and TailwindCSS that provides real-time market data from the CoinGecko API.

## 🚀 Features

### Core Functionality
- **Live Market Data**: Real-time cryptocurrency prices, market caps, and trading volumes
- **Advanced Search**: Debounced search functionality to find coins by name or symbol
- **Smart Sorting**: Multi-column sorting by price, market cap, volume, and 24h changes
- **Detailed Views**: Comprehensive coin information including price history and market statistics
- **Market Highlights**: Top gainers, losers, highest volume coins, and trending cryptocurrencies

### User Experience
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Loading States**: Skeleton loaders and loading indicators for better UX
- **Error Handling**: Robust error handling with retry mechanisms
- **Real-time Updates**: Automatic data refresh every 5 minutes
- **Interactive Elements**: Hover states, animations, and smooth transitions

## 🛠 Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **API**: CoinGecko API v3

## 🏗 Architecture Overview

### Component Structure
```
src/
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── LoadingSkeleton.tsx
│   │   ├── ErrorMessage.tsx
│   │   ├── EmptyState.tsx
│   │   └── SearchInput.tsx
│   ├── CoinsTable.tsx      # Main cryptocurrency table
│   ├── CoinModal.tsx       # Detailed coin information modal
│   └── HighlightsSection.tsx # Market highlights cards
├── hooks/
│   └── useCryptoData.ts    # Custom hooks for API calls
├── services/
│   └── api.ts              # API service layer
├── types/
│   └── crypto.ts           # TypeScript type definitions
└── App.tsx                 # Main application component
```

### Design Patterns Used

1. **Custom Hooks Pattern**: Encapsulates data fetching logic and provides a clean interface
2. **Compound Component Pattern**: Used in table and modal components for flexibility
3. **Service Layer Pattern**: Separates API logic from components
4. **Error Boundary Pattern**: Graceful error handling throughout the application
5. **Loading State Pattern**: Consistent loading states with skeleton screens

### State Management Strategy

- **TanStack Query**: Handles server state, caching, and synchronization
- **React useState**: Manages local component state (search, pagination, modals)
- **Query Invalidation**: Smart cache invalidation for real-time updates

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration (API key is optional for basic usage)
```

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 in your browser

### Build for Production

```bash
npm run build
npm run preview
```

## 🔧 Configuration

### Environment Variables

- `VITE_COINGECKO_API_KEY` (optional): CoinGecko Pro API key
- `VITE_APP_NAME`: Application name
- `VITE_API_BASE_URL`: API base URL

### API Rate Limits

The application uses CoinGecko's free tier with the following considerations:
- Rate limit: 10-50 calls/minute
- Automatic retry with exponential backoff
- Request caching to minimize API calls
- Data refresh interval optimized for rate limits

## 📊 Key Features Explained

### Search & Filtering
- **Debounced Search**: 300ms debounce to prevent excessive API calls
- **Client-side Filtering**: Fast filtering of cached data
- **Case-insensitive**: Search by name or symbol

### Sorting System
- **Multi-column Sorting**: Sort by any table column
- **Visual Indicators**: Clear sort direction indicators
- **Persistent State**: Sort preferences maintained during navigation

### Error Handling
- **Retry Logic**: Automatic retry with exponential backoff
- **Friendly Messages**: User-friendly error messages
- **Fallback States**: Graceful degradation when data is unavailable

### Performance Optimizations
- **Data Caching**: Intelligent caching with TanStack Query
- **Lazy Loading**: Components and data loaded on demand
- **Memoization**: Optimized re-renders with useMemo
- **Virtual Scrolling**: Efficient handling of large datasets

## 🔮 Future Improvements

### Immediate Enhancements
- [ ] Dark mode support
- [ ] Export data functionality (CSV/JSON)
- [ ] Advanced filtering (price ranges, market cap tiers)
- [ ] Portfolio tracking features
- [ ] Price alerts and notifications

### Scalability Improvements
- [ ] Virtual scrolling for large datasets
- [ ] Progressive Web App (PWA) features
- [ ] Real-time WebSocket connections
- [ ] Advanced charting with historical data
- [ ] Multi-currency support

### Production Readiness
- [ ] Comprehensive error monitoring (Sentry)
- [ ] Performance monitoring and analytics
- [ ] A/B testing framework
- [ ] Automated testing suite (unit, integration, e2e)
- [ ] CI/CD pipeline with automated deployments

## 🧪 Testing Strategy

### Current Implementation
- Error boundary testing with different failure scenarios
- API error handling and retry logic validation
- Responsive design testing across devices

### Recommended Testing Stack
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: MSW for API mocking
- **E2E Tests**: Playwright or Cypress
- **Performance Tests**: Lighthouse CI

## 🚀 Deployment

### Recommended Platforms
- **Vercel**: Zero-config deployment with automatic previews
- **Netlify**: JAMstack hosting with form handling
- **GitHub Pages**: Free static hosting
- **AWS S3 + CloudFront**: Enterprise-grade hosting

### Production Considerations
- Environment variable management
- CDN configuration for static assets
- Gzip compression and caching headers
- Security headers and CORS configuration

## 📚 Learning Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [CoinGecko API Documentation](https://www.coingecko.com/en/api/documentation)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using modern web technologies**