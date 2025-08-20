import { Router } from 'express';
import { register, login } from '../controllers/auth';
import { validateBody } from '../middleware/validation';
import { registerSchema, loginSchema } from '../validation/schemas';

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Inscription d'un nouvel utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Charlot DEDJINOU"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "charlot@gmail.com"
 *               password:
 *                 type: string
 *                 minimum: 6
 *                 example: "azerty"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Erreur de validation
 *       409:
 *         description: Email déjà utilisé
 */
router.post('/register', validateBody(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "charlot@gmail.com"
 *               password:
 *                 type: string
 *                 example: "azerty"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 token_type:
 *                   type: string
 *                   example: "Bearer"
 *                 expires_in:
 *                   type: number
 *                   example: 7200
 *       401:
 *         description: Identifiants invalides
 *       400:
 *         description: Erreur de validation
 */
router.post('/login', validateBody(loginSchema), login);

export default router;