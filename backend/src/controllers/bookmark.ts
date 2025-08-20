import { Response } from 'express';
import { Bookmark } from '../models/Bookmark';
import { AuthenticatedRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';

export const createBookmark = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {

  const { title, url, category, status = 'unread' } = req.body;

  const bookmark = new Bookmark({
    title,
    url,
    category,
    status,
    userId: req.user!.id
  });

  await bookmark.save();

  res.status(201).json(bookmark.toJSON());
});

export const getAllBookmarks = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const bookmarks = await Bookmark.find({ userId: req.user!.id })
    .sort({ created_at: -1 });

  res.json(bookmarks.map(bookmark => bookmark.toJSON()));
});

export const getBookmarkById = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const bookmark = await Bookmark.findOne({ 
    id: parseInt(id), 
    userId: req.user!.id 
  });

  if (!bookmark) {
    res.status(404).json({
      message: 'Bookmark non trouvé',
      error: 'BOOKMARK_NOT_FOUND'
    });
    return;
  }

  res.json(bookmark.toJSON());
});

export const updateBookmark = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;
  const updateData = req.body;

  const bookmark = await Bookmark.findOneAndUpdate(
    { id: parseInt(id), userId: req.user!.id },
    { ...updateData, updated_at: new Date() },
    { new: true, runValidators: true }
  );

  if (!bookmark) {
    res.status(404).json({
      message: 'Bookmark non trouvé',
      error: 'BOOKMARK_NOT_FOUND'
    });
    return;
  }

  res.json(bookmark.toJSON());
});

export const deleteBookmark = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const bookmark = await Bookmark.findOneAndDelete({
    id: parseInt(id),
    userId: req.user!.id
  });

  if (!bookmark) {
    res.status(404).json({
      message: 'Bookmark non trouvé',
      error: 'BOOKMARK_NOT_FOUND'
    });
    return;
  }

  res.status(204).send();
});

export const markAsRead = asyncHandler(async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { id } = req.params;

  const bookmark = await Bookmark.findOneAndUpdate(
    { id: parseInt(id), userId: req.user!.id },
    { status: 'read', updated_at: new Date() },
    { new: true, runValidators: true }
  );

  if (!bookmark) {
    res.status(404).json({
      message: 'Bookmark non trouvé',
      error: 'BOOKMARK_NOT_FOUND'
    });
    return;
  }

  res.json(bookmark.toJSON());
});