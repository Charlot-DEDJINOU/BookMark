import { getResource, postResource } from './api';
import type { LoginCredentials, RegisterData, AuthResponse, User } from '../types';
import { getData, removeData, storeData } from '../utils/localStorage';

export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly TOKEN_EXPIRY_KEY = 'token_expiry';

  /**
   * Connexion utilisateur
   */
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await postResource<AuthResponse>('/auth/login', credentials);
      const authData = response.data;
      
      // Stocker le token et sa date d'expiration
      this.setToken(authData.access_token, authData.expires_in);
      
      return authData;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la connexion');
    }
  }

  /**
   * Inscription utilisateur
   */
  static async register(userData: RegisterData): Promise<User> {
    try {
      const response = await postResource<User>('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de l\'inscription');
    }
  }

  /**
   * Récupérer les informations de l'utilisateur connecté
   */
  static async getCurrentUser(): Promise<User> {
    try {
      const response = await getResource<User>('/me');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du profil');
    }
  }

  /**
   * Stocker le token d'authentification
   */
  private static setToken(token: string, expiresIn: number): void {
    const expiryTime = Date.now() + (expiresIn * 1000);
    storeData(this.TOKEN_KEY, token);
    storeData(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  /**
   * Récupérer le token d'authentification
   */
  static getToken(): string | null {
    const token = getData(this.TOKEN_KEY);
    const expiry = getData(this.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) {
      return null;
    }

    // Vérifier si le token a expiré
    if (Date.now() > parseInt(expiry)) {
      this.logout();
      return null;
    }

    return token;
  }

  /**
   * Vérifier si l'utilisateur est authentifié
   */
  static isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Déconnexion utilisateur
   */
  static logout(): void {
    removeData(this.TOKEN_KEY);
    removeData(this.TOKEN_EXPIRY_KEY);
  }
}