import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, migrate } from './db.js';
import { optionalAuth } from './auth.js';
import { authRouter } from './routes/auth.js';
import { listingsRouter } from './routes/listings.js';
import { ownerRouter, meRouter } from './routes/owner.js';

dotenv.config();
migrate();

const app = express();
const origin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(optionalAuth);

app.get('/api/health', (_req, res) => {
  const listings = db.prepare('SELECT COUNT(*) AS n FROM listings').get().n;
  res.json({ ok: true, listings });
});

app.use('/api/auth', authRouter);
app.use('/api/listings', listingsRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/me', meRouter);

// In production the Docker image places the Vite build beside the server.
// Keeping this optional lets the API continue to run normally during local development.
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong.' });
});

const port = Number(process.env.PORT) || 4001;
app.listen(port, () => {
  console.log(`Haven API listening on http://localhost:${port}`);
});
