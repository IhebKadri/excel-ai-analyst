import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import fs from 'fs';

import { env } from './config/env';
import { logger } from './utils/logger';

import { UserRepository } from './repositories/UserRepository';

import { AuthService } from './services/AuthService';

import { AuthController } from './controllers/AuthController';

import { createAuthRouter } from './routes/auth.routes';

import { errorMiddleware } from './middlewares/error.middleware';

fs.mkdirSync(env.uploadDir, { recursive: true });

const userRepo      = new UserRepository();
const authService   = new AuthService(userRepo);
const authController = new AuthController(authService);

const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/auth', createAuthRouter(authController));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.use(errorMiddleware);

app.listen(env.port, () => {
  logger.info(`Server running on http://localhost:${env.port}`);
});

export default app;