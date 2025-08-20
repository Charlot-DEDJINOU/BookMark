import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        message: 'Utilisateur non authentifié',
        error: 'UNAUTHORIZED'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: 'Utilisateur non authentifié',
        error: 'UNAUTHORIZED'
      });
    }

    req.user = {
      name: user.name,
      email: user.email,
      id: user.id
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        message: 'Token expiré',
        error: 'TOKEN_EXPIRED'
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        message: 'Token invalide',
        error: 'INVALID_TOKEN'
      });
      return;
    }

    console.error('Erreur d\'authentification:', error);
    res.status(500).json({
      message: 'Erreur interne du serveur',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};