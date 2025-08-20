import { Router } from 'express';
import {
  createBookmark,
  getAllBookmarks,
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
  markAsRead
} from '../controllers/bookmark';
import { authenticateToken } from '../middleware/auth';
import { validateBody, validateParams } from '../middleware/validation';
import { 
  createBookmarkSchema, 
  updateBookmarkSchema, 
  idParamSchema 
} from '../validation/schemas';

const router = Router();

// Toutes les routes nécessitent une authentification
router.use(authenticateToken);

/**
 * @swagger
 * /bookmarks:
 *   post:
 *     summary: Créer un nouveau bookmark
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - url
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Example Site"
 *               url:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com"
 *               category:
 *                 type: string
 *                 example: "tech"
 *               status:
 *                 type: string
 *                 enum: [unread, read, reading]
 *                 default: unread
 *     responses:
 *       201:
 *         description: Bookmark créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 */
router.post('/', validateBody(createBookmarkSchema), createBookmark);

/**
 * @swagger
 * /bookmarks:
 *   get:
 *     summary: Récupérer tous les bookmarks de l'utilisateur
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des bookmarks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bookmark'
 *       401:
 *         description: Non authentifié
 */
router.get('/', getAllBookmarks);

/**
 * @swagger
 * /bookmarks/{id}:
 *   get:
 *     summary: Récupérer un bookmark par ID
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du bookmark
 *     responses:
 *       200:
 *         description: Bookmark trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Bookmark non trouvé
 */
router.get('/:id', validateParams(idParamSchema), getBookmarkById);

/**
 * @swagger
 * /bookmarks/{id}:
 *   put:
 *     summary: Mettre à jour un bookmark
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du bookmark
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               url:
 *                 type: string
 *                 format: uri
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [unread, read, reading]
 *     responses:
 *       200:
 *         description: Bookmark mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       400:
 *         description: Erreur de validation
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Bookmark non trouvé
 */
router.put('/:id', 
  validateParams(idParamSchema), 
  validateBody(updateBookmarkSchema), 
  updateBookmark
);

/**
 * @swagger
 * /bookmarks/{id}:
 *   delete:
 *     summary: Supprimer un bookmark
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du bookmark
 *     responses:
 *       204:
 *         description: Bookmark supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Bookmark non trouvé
 */
router.delete('/:id', validateParams(idParamSchema), deleteBookmark);

/**
 * @swagger
 * /bookmarks/{id}/read:
 *   patch:
 *     summary: Marquer un bookmark comme lu
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du bookmark
 *     responses:
 *       200:
 *         description: Bookmark marqué comme lu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Bookmark'
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Bookmark non trouvé
 */
router.patch('/:id/read', validateParams(idParamSchema), markAsRead);

export default router;