import { Response } from 'express';
import { User } from '../models/User';
import { AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';

export const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const user = await User.findOne({ id: req.user!.id });
  
  if (!user) {
    res.status(404).json({
      message: 'Utilisateur non trouvé',
      error: 'USER_NOT_FOUND'
    });
    return;
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at
  });
});