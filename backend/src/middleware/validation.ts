import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

type ValidationType = 'body' | 'params' | 'query';

export const validate = (schema: Schema, type: ValidationType = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const dataToValidate = req[type];
    
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      res.status(400).json({
        message: 'Données de validation invalides',
        error: 'VALIDATION_ERROR',
        details: errorDetails
      });
      return;
    }

    // Remplacer les données validées dans la requête
    req[type] = value;
    next();
  };
};

// Middleware spécialisés pour chaque type
export const validateBody = (schema: Schema) => validate(schema, 'body');
export const validateParams = (schema: Schema) => validate(schema, 'params');
export const validateQuery = (schema: Schema) => validate(schema, 'query');