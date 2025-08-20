import { Response } from 'express';
import { Bookmark } from '../models/Bookmark';
import { AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';

export const getStats = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  // Statistiques par statut
  const statusStats = await Bookmark.aggregate([
    { $match: { userId: req.user!.id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  // Statistiques par catégorie
  const categoryStats = await Bookmark.aggregate([
    { $match: { userId: req.user!.id } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  // Nombre total de bookmarks
  const total = await Bookmark.countDocuments({ userId: req.user!.id });

  // Organiser les statistiques par statut
  const statusMap = {
    read: 0,
    reading: 0,
    unread: 0
  };

  statusStats.forEach(stat => {
    if (stat._id in statusMap) {
      statusMap[stat._id as keyof typeof statusMap] = stat.count;
    }
  });

  // Formater les statistiques par catégorie
  const byCategory = categoryStats.map(stat => ({
    category: stat._id,
    count: stat.count
  }));

  res.json({
    total,
    read: statusMap.read,
    reading: statusMap.reading,
    unread: statusMap.unread,
    byCategory
  });
});