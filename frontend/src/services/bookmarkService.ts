import type { Bookmark, CreateBookmarkData, UpdateBookmarkData } from '../types';
import { getResource, patchResource, postResource, putResource, removeResource } from './api';

export class BookmarkService {
  /**
   * Récupérer tous les bookmarks
   */
  static async getAllBookmarks(): Promise<Bookmark[]> {
    try {
      const response = await getResource<Bookmark[]>('/bookmarks');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des bookmarks');
    }
  }

  /**
   * Récupérer un bookmark par son ID
   */
  static async getBookmarkById(id: number): Promise<Bookmark> {
    try {
      const response = await getResource<Bookmark>(`/bookmarks/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération du bookmark');
    }
  }

  /**
   * Créer un nouveau bookmark
   */
  static async createBookmark(bookmarkData: CreateBookmarkData): Promise<Bookmark> {
    try {
      const response = await postResource<Bookmark>('/bookmarks', bookmarkData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du bookmark');
    }
  }

  /**
   * Mettre à jour un bookmark
   */
  static async updateBookmark(id: number, bookmarkData: UpdateBookmarkData): Promise<Bookmark> {
    try {
      const response = await putResource<Bookmark>('/bookmarks', id, bookmarkData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du bookmark');
    }
  }

  /**
   * Supprimer un bookmark
   */
  static async deleteBookmark(id: number): Promise<void> {
    try {
      await removeResource('/bookmarks',id);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors de la suppression du bookmark');
    }
  }

  /**
   * Marquer un bookmark comme lu
   */
  static async markAsRead(id: number): Promise<void> {
    try {
      await patchResource(`/bookmarks/${id}/read`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Erreur lors du marquage comme lu');
    }
  }
}