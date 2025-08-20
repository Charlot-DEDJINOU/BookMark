import { Router } from 'express';
import { getCurrentUser } from '../controllers/user';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Récupérer les informations de l'utilisateur connecté
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/', authenticateToken, getCurrentUser);

export default router;