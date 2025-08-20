import Joi from 'joi';

// Schémas d'authentification
export const registerSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.min': 'Le nom doit contenir au moins 2 caractères',
      'string.max': 'Le nom ne peut pas dépasser 50 caractères',
      'any.required': 'Le nom est requis'
    }),
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Format d\'email invalide',
      'any.required': 'L\'email est requis'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le mot de passe est requis'
    })
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Format d\'email invalide',
      'any.required': 'L\'email est requis'
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Le mot de passe est requis'
    })
});

// Schémas pour les bookmarks
export const createBookmarkSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .trim()
    .required()
    .messages({
      'string.min': 'Le titre ne peut pas être vide',
      'string.max': 'Le titre ne peut pas dépasser 200 caractères',
      'any.required': 'Le titre est requis'
    }),
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .required()
    .messages({
      'string.uri': 'Format d\'URL invalide',
      'any.required': 'L\'URL est requise'
    }),
  category: Joi.string()
    .min(1)
    .max(50)
    .trim()
    .required()
    .messages({
      'string.min': 'La catégorie ne peut pas être vide',
      'string.max': 'La catégorie ne peut pas dépasser 50 caractères',
      'any.required': 'La catégorie est requise'
    }),
  status: Joi.string()
    .valid('unread', 'read', 'reading')
    .default('unread')
    .messages({
      'any.only': 'Le statut doit être: unread, read, ou reading'
    })
});

export const updateBookmarkSchema = Joi.object({
  title: Joi.string()
    .min(1)
    .max(200)
    .trim()
    .messages({
      'string.min': 'Le titre ne peut pas être vide',
      'string.max': 'Le titre ne peut pas dépasser 200 caractères'
    }),
  url: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .messages({
      'string.uri': 'Format d\'URL invalide'
    }),
  category: Joi.string()
    .min(1)
    .max(50)
    .trim()
    .messages({
      'string.min': 'La catégorie ne peut pas être vide',
      'string.max': 'La catégorie ne peut pas dépasser 50 caractères'
    }),
  status: Joi.string()
    .valid('unread', 'read', 'reading')
    .messages({
      'any.only': 'Le statut doit être: unread, read, ou reading'
    })
}).min(1).messages({
  'object.min': 'Au moins un champ doit être fourni pour la mise à jour'
});

export const idParamSchema = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'L\'ID doit être un nombre',
      'number.integer': 'L\'ID doit être un entier',
      'number.positive': 'L\'ID doit être positif',
      'any.required': 'L\'ID est requis'
    })
});