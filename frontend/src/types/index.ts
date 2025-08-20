// Types pour l'authentification
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

// Types pour les bookmarks
export type BookmarkStatus = 'read' | 'reading' | 'unread';

export interface Bookmark {
  id: number;
  title: string;
  url: string;
  category: string;
  status: BookmarkStatus;
  created_at: string;
  updated_at: string;
}

export interface CreateBookmarkData {
  title: string;
  url: string;
  category: string;
  status: BookmarkStatus;
}

export interface UpdateBookmarkData extends CreateBookmarkData {}

// Types pour les statistiques
export interface CategoryStat {
  category: string;
  count: number;
}

export interface Stats {
  total: number;
  read: number;
  reading: number;
  unread: number;
  byCategory: CategoryStat[];
}

// Types pour les composants
export interface ApiError {
  message: string;
  status?: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}