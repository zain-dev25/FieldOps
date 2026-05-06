import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB (safe to call multiple times — Mongoose caches the connection)
connectDB();

const app = express();

// CORS configuration: Allow all origins for simplicity (adjust in production) 
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'API is running...', env: process.env.NODE_ENV || 'development' });
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);

// ── Error handlers ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Local dev server ──────────────────────────────────────────────────────────
// Vercel uses api/index.js which imports and exports `app` — no listen() needed there.
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in development mode on port ${PORT}`);
  });
}

export default app;
