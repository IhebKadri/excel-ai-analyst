import rateLimit from 'express-rate-limit';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many attempts, please try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const analysisRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { success: false, error: 'Too many requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});