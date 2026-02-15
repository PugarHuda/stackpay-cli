const express = require('express');
const { x402Handler } = require('./middleware/x402-handler');
const config = require('./stackpay.config.json');

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Health check (no payment required)
app.get('/', (req, res) => {
  res.json({
    name: 'test-api',
    status: 'running',
    pricing: `${config.price} ${config.currency} per API call`,
    docs: '/docs',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply x402 payment middleware to API routes
app.use('/api', x402Handler(config));

// Your monetized API endpoints
app.get('/api/data', async (req, res) => {
  try {
    const result = {
      message: 'Hello from test-api!',
      data: {
        example: 'This is a paid API response',
        timestamp: new Date().toISOString(),
      },
      meta: {
        price: config.price,
        currency: config.currency,
      },
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Documentation endpoint (free)
app.get('/docs', (req, res) => {
  res.json({
    name: 'test-api',
    version: '1.0.0',
    endpoints: [
      {
        path: '/api/data',
        method: 'GET',
        description: 'Get data from the API',
        price: `${config.price} ${config.currency}`,
        authentication: 'x402 payment proof via X-Payment-Proof header',
      },
    ],
    payment: {
      protocol: 'x402-stacks',
      currency: config.currency,
      network: config.network,
      address: config.paymentAddress,
      price: config.price,
    },
  });
});

app.listen(PORT, () => {
  console.log('');
  console.log(`  test-api running on http://localhost:${PORT}`);
  console.log(`  Accepting ${config.currency} payments at ${config.price} per call`);
  console.log(`  API docs at http://localhost:${PORT}/docs`);
  console.log('');
});
