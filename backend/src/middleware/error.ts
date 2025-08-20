import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';

export interface ApiError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = error.statusCode || 500;
  let message = error.message || 'Erreur interne du serveur';
  let errorType = 'INTERNAL_SERVER_ERROR';

  // Gestion des erreurs MongoDB/Mongoose
  if (error instanceof MongooseError.ValidationError) {
    statusCode = 400;
    message = 'Erreur de validation';
    errorType = 'VALIDATION_ERROR';
  }

  if (error instanceof MongooseError.CastError) {
    statusCode = 400;
    message = 'Format d\'ID invalide';
    errorType = 'INVALID_ID_FORMAT';
  }

  // Erreur de duplication (email déjà utilisé, etc.)
  if ('code' in error && error.code === 11000) {
    statusCode = 409;
    message = 'Cette ressource existe déjà';
    errorType = 'DUPLICATE_RESOURCE';

    if (typeof error === "object" && error !== null && "keyPattern" in error) {
      const e = error as { keyPattern: Record<string, any> };

      if ("email" in e.keyPattern) {
        message = "Cette adresse email est déjà utilisée";
        errorType = "EMAIL_ALREADY_EXISTS";
      }
    }
  }

  // Log de l'erreur en développement
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Details:', {
      message: error.message,
      stack: error.stack,
      statusCode,
      url: req.url,
      method: req.method,
      body: req.body,
      params: req.params
    });
  }

  res.status(statusCode).json({
    message,
    error: errorType,
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error
    })
  });
};

// Middleware pour capturer les erreurs async
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};