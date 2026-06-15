import rateLimit from 'express-rate-limit';

interface RateLimitOptions {
  windowMinutes: number;
  max: number;
  message?: string;
}

export function createRateLimiter({ windowMinutes, max, message }: RateLimitOptions) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    message: { success: false, error: message ?? 'Too many requests, please slow down' },
    standardHeaders: true,
    legacyHeaders: false,
  });
}