import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { connectDB } from './db.js';
import productsRouter from './routes/products.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDir = path.resolve(__dirname, '../client');

async function startServer() {
  const app = express();
  // Dev server must always bind to port 3000 in AI Studio
  const PORT = 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Connect to MongoDB Atlas via process.env.MONGODB_URI
  try {
    await connectDB();
  } catch (err) {
    console.error('⚠️ MongoDB initialization note:', err.message);
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    const isConnected = mongoose.connection.readyState === 1;
    res.status(isConnected ? 200 : 503).json({
      status: isConnected ? 'ok' : 'error',
      service: 'NOIR MEN Fashion API',
      database: 'MongoDB Atlas',
      mongodb: isConnected ? 'connected' : 'disconnected',
      hasMongoUri: Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim()),
      message: isConnected
        ? 'Connected to MongoDB Atlas'
        : process.env.MONGODB_URI
          ? 'Failed to connect to MongoDB Atlas. Please check credentials and Atlas IP Network Access.'
          : 'MONGODB_URI is missing. Please set MONGODB_URI in your .env file.',
      timestamp: new Date().toISOString()
    });
  });

  // Database connection check middleware for database-dependent operations
  const checkDatabaseConnection = (req, res, next) => {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        success: false,
        error: 'Database connection unavailable',
        message: !process.env.MONGODB_URI
          ? 'MONGODB_URI environment variable is missing. Please set your MongoDB Atlas connection string in your .env file or environment settings.'
          : 'Cannot reach MongoDB Atlas. Please verify that your Atlas cluster is active, credentials in MONGODB_URI are valid, and your IP address is whitelisted in Atlas Network Access.'
      });
    }
    next();
  };

  // Mount REST API routes
  app.use('/api/products', checkDatabaseConnection, productsRouter);
  app.use('/api/orders', checkDatabaseConnection, ordersRouter);
  app.use('/api/admin', adminRouter);

  // Serve static assets from client public directory
  app.use('/assets', express.static(path.join(clientDir, 'public/assets')));

  // Frontend mounting: Vite middleware in development, static build in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      root: clientDir,
      configFile: fs.existsSync(path.resolve(clientDir, 'vite.config.js'))
        ? path.resolve(clientDir, 'vite.config.js')
        : path.resolve(clientDir, 'vite.config.ts'),
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });

    app.use(vite.middlewares);

    // Explicit fallback for client-side routing in Vite dev middleware mode
    app.use('*', async (req, res, next) => {
      if (req.method !== 'GET') return next();
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(clientDir, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    const distPath = fs.existsSync(path.join(clientDir, 'dist'))
      ? path.join(clientDir, 'dist')
      : path.resolve(__dirname, '../dist');
    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      const htmlFile = fs.existsSync(path.join(distPath, 'index.html'))
        ? path.join(distPath, 'index.html')
        : path.resolve(clientDir, 'index.html');
      res.sendFile(htmlFile);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NOIR MEN server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Fatal server startup error:', error);
  process.exit(1);
});
