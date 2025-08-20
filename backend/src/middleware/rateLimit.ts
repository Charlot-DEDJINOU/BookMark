import rateLimit from 'express-rate-limit';

export const generalLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 100,
  message: {
    error: 'Trop de requêtes, veuillez réessayer plus tard'
  },
  standardHeaders: true,
  legacyHeaders: false
});

export const authLimiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 50,
  message: {
    error: 'Trop de tentatives d\'authenfication, veuillez réessayer plus tard'
  },
  standardHeaders: true,
  legacyHeaders: false
});