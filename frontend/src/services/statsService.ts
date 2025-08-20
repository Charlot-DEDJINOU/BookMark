
import type { Stats } from '../types';
import { getResource } from './api';

export class StatsService {
  /**
   * Récupérer les statistiques des bookmarks
   */
  static async getStats(): Promise<Stats> {
    try {
      const response = await getResource<Stats>('/stats');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des statistiques');
    }
  }
}