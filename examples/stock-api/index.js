const express = require('express');
const { x402Handler } = require('./middleware/x402-handler');
const config = require('./stackpay.config.json');

const app = express();
const PORT = process.env.PORT || 3002;

// Simulated real-time stock data with dynamic pricing
const STOCKS = {
  AAPL: { name: 'Apple Inc.', basePrice: 175.43, sector: 'Technology' },
  GOOGL: { name: 'Alphabet Inc.', basePrice: 142.87, sector: 'Technology' },
  MSFT: { name: 'Microsoft Corp.', basePrice: 378.91, sector: 'Technology' },
  AMZN: { name: 'Amazon.com Inc.', basePrice: 178.25, sector: 'Consumer Cyclical' },
  TSLA: { name: 'Tesla Inc.', basePrice: 248.42, sector: 'Automotive' },
  BTC: { name: 'Bitcoin', basePrice: 97500.00, sector: 'Cryptocurrency' },
  STX: { name: 'Stacks', basePrice: 1.85, sector: 'Cryptocurrency' },
  ETH: { name: 'Ethereum', basePrice: 3450.00, sector: 'Cryptocurrency' },
  NVDA: { name: 'NVIDIA Corp.', basePrice: 875.28, sector: 'Technology' },
  META: { name: 'Meta Platforms', basePrice: 485.58, sector: 'Technology' },
};

// Simulate price fluctuation
function getStockPrice(stock) {
  const fluctuation = (Math.random() - 0.5) * 2; // -1% to +1%
  const change = stock.basePrice * (fluctuation / 100);
  const currentPrice = +(stock.basePrice + change).toFixed(2);
  const changePercent = +fluctuation.toFixed(4);
  const changeAmount = +change.toFixed(2);

  return {
    price: currentPrice,
    change: changeAmount,
    changePercent,
    high24h: +(stock.basePrice * 1.02).toFixed(2),
    low24h: +(stock.basePrice * 0.98).toFixed(2),
    volume: Math.floor(Math.random() * 50000000) + 1000000,
    marketCap: +(currentPrice * (Math.random() * 1000000000 + 100000000)).toFixed(0),
  };
}

// API info (free)
app.get('/', (req, res) => {
  res.json({
    name: 'StackPay Stock API',
    version: '1.0.0',
    description: 'Real-time stock & crypto data monetized with Bitcoin micropayments',
    pricing: `${config.price} ${config.currency} per request`,
    endpoints: [
      { path: '/api/stock/:symbol', method: 'GET', description: 'Get stock quote' },
      { path: '/api/stocks', method: 'GET', description: 'Get all stock quotes' },
      { path: '/api/crypto', method: 'GET', description: 'Get crypto prices' },
    ],
    symbols: Object.keys(STOCKS),
  });
});

// Apply payment middleware
app.use('/api', x402Handler(config));

// Single stock quote
app.get('/api/stock/:symbol', (req, res) => {
  const symbol = req.params.symbol.toUpperCase();
  const stock = STOCKS[symbol];

  if (!stock) {
    return res.status(404).json({
      error: 'Symbol not found',
      message: `Symbol "${symbol}" not available. Try: ${Object.keys(STOCKS).join(', ')}`,
    });
  }

  const priceData = getStockPrice(stock);

  res.json({
    symbol,
    name: stock.name,
    sector: stock.sector,
    ...priceData,
    timestamp: new Date().toISOString(),
    payment: {
      verified: true,
      price: config.price,
      currency: config.currency,
    },
  });
});

// All stock quotes
app.get('/api/stocks', (req, res) => {
  const quotes = {};
  for (const [symbol, stock] of Object.entries(STOCKS)) {
    if (stock.sector !== 'Cryptocurrency') {
      quotes[symbol] = {
        name: stock.name,
        sector: stock.sector,
        ...getStockPrice(stock),
      };
    }
  }

  res.json({
    stocks: quotes,
    count: Object.keys(quotes).length,
    timestamp: new Date().toISOString(),
  });
});

// Crypto prices
app.get('/api/crypto', (req, res) => {
  const cryptos = {};
  for (const [symbol, stock] of Object.entries(STOCKS)) {
    if (stock.sector === 'Cryptocurrency') {
      cryptos[symbol] = {
        name: stock.name,
        ...getStockPrice(stock),
      };
    }
  }

  res.json({
    cryptocurrencies: cryptos,
    count: Object.keys(cryptos).length,
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log(`  📈 Stock API running on http://localhost:${PORT}`);
  console.log(`  💰 Price: ${config.price} ${config.currency} per request`);
  console.log(`  📄 Docs: http://localhost:${PORT}/`);
  console.log('');
});
