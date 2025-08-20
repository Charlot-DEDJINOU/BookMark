<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <!-- Logo -->
          <router-link to="/dashboard" class="flex items-center space-x-2">
            <BookmarkIcon class="h-8 w-8 text-primary-600" />
            <span class="text-xl font-bold text-gray-900">BookmarkApp</span>
          </router-link>

          <!-- Navigation principale -->
          <div class="hidden sm:ml-10 sm:flex sm:space-x-8">
            <router-link
              to="/dashboard"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors"
              :class="[
                $route.name === 'dashboard'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              <BarChart3Icon class="h-4 w-4 mr-2" />
              Tableau de bord
            </router-link>

            <router-link
              to="/bookmarks"
              class="inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors"
              :class="[
                $route.name === 'bookmarks'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              <BookmarksIcon class="h-4 w-4 mr-2" />
              Favoris
            </router-link>
          </div>
        </div>

        <!-- Menu utilisateur -->
        <div class="flex items-center space-x-4">
          <!-- Informations utilisateur -->
          <div v-if="user" class="hidden sm:flex sm:items-center sm:space-x-3">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <UserIcon class="h-4 w-4 text-primary-600" />
              </div>
              <span class="text-sm font-medium text-gray-700">{{ user.name }}</span>
            </div>
          </div>

          <!-- Bouton déconnexion -->
          <Button
            variant="outline"
            size="sm"
            @click="handleLogout"
            :loading="isLoggingOut"
          >
            <LogOutIcon class="h-4 w-4 mr-2" />
            Déconnexion
          </Button>

          <!-- Menu mobile -->
          <button
            @click="showMobileMenu = !showMobileMenu"
            class="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <MenuIcon v-if="!showMobileMenu" class="h-6 w-6" />
            <XIcon v-else class="h-6 w-6" />
          </button>
        </div>
      </div>

      <!-- Menu mobile -->
      <div v-if="showMobileMenu" class="sm:hidden border-t border-gray-200">
        <div class="pt-2 pb-3 space-y-1">
          <router-link
            to="/dashboard"
            @click="showMobileMenu = false"
            class="flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors"
            :class="[
              $route.name === 'dashboard'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <BarChart3Icon class="h-5 w-5 mr-3" />
            Tableau de bord
          </router-link>

          <router-link
            to="/bookmarks"
            @click="showMobileMenu = false"
            class="flex items-center px-3 py-2 text-base font-medium rounded-md transition-colors"
            :class="[
              $route.name === 'bookmarks'
                ? 'text-primary-600 bg-primary-50'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            ]"
          >
            <BookmarksIcon class="h-5 w-5 mr-3" />
            Favoris
          </router-link>
        </div>

        <!-- Informations utilisateur mobile -->
        <div v-if="user" class="pt-4 pb-3 border-t border-gray-200">
          <div class="flex items-center px-4">
            <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <UserIcon class="h-5 w-5 text-primary-600" />
            </div>
            <div class="ml-3">
              <div class="text-base font-medium text-gray-800">{{ user.name }}</div>
              <div class="text-sm font-medium text-gray-500">{{ user.email }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { 
  BookmarkIcon, 
  BarChart3Icon, 
  UserIcon, 
  LogOutIcon,
  MenuIcon,
  XIcon,
  Bookmark as BookmarksIcon
} from 'lucide-vue-next';
import { AuthService } from '../../services/authService';
import Button from '../../components/commons/Button.vue';
import type { User } from '../../types';

const router = useRouter();
const user = ref<User | null>(null);
const isLoggingOut = ref(false);
const showMobileMenu = ref(false);

onMounted(async () => {
  try {
    if (AuthService.isAuthenticated()) {
      user.value = await AuthService.getCurrentUser();
    }
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
  }
});

const handleLogout = async () => {
  isLoggingOut.value = true;
  try {
    AuthService.logout();
    await router.push('/');
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
  } finally {
    isLoggingOut.value = false;
  }
};
</script>