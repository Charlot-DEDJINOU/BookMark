import { Router } from 'express';
import { getStats } from '../controllers/stats';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Récupérer les statistiques des bookmarks de l'utilisateur
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistiques des bookmarks
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Stats'
 *       401:
 *         description: Non authentifié
 */
router.get('/', authenticateToken, getStats);

export default router;