import { Request, Response } from 'express';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import { User } from '../models/User';
import { asyncHandler } from '../middleware/error';

const generateToken = (userId: string): { token : string, expiresIn: number} => {
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = parseInt(process.env.JWT_EXPIRES_IN || '7200');
    const token = jwt.sign(
        { userId },
        jwtSecret as Secret,
        { expiresIn: expiresIn as SignOptions['expiresIn'] }
    );

    return { token, expiresIn }
};

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(409).json({
            message: 'Cette adresse email est déjà utilisée',
            error: 'EMAIL_ALREADY_EXISTS'
        });
        return;
    }

    // Créer le nouvel utilisateur
    const user = new User({
        name,
        email,
        password
    });

    await user.save();

    res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at
    });
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
        res.status(401).json({
            message: 'Identifiants invalides',
            error: 'INVALID_CREDENTIALS'
        });
        return;
    }

    // Vérifier le mot de passe
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
        res.status(401).json({
            message: 'Identifiants invalides',
            error: 'INVALID_CREDENTIALS'
        });
        return;
    }

    const { token, expiresIn } = generateToken(user._id.toString());

    res.json({
        access_token: token,
        token_type: 'Bearer',
        expires_in: expiresIn
    });
});