<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header avec actions -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 mb-2">Mes favoris</h1>
          <p class="text-gray-600">
            Gérez et organisez votre collection de liens favoris
          </p>
        </div>
        
        <div class="mt-4 md:mt-0 flex space-x-3">
          <Button
            variant="outline"
            @click="fetchBookmarks"
            :loading="isLoading && bookmarks.length > 0"
          >
            <RefreshCwIcon class="h-4 w-4 mr-2" />
            Actualiser
          </Button>
          
          <Button @click="showAddModal = true">
            <PlusIcon class="h-4 w-4 mr-2" />
            Ajouter un favori
          </Button>
        </div>
      </div>
      
      <!-- Filtres et recherche -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- Recherche -->
          <Input
            v-model="filters.search"
            type="text"
            placeholder="Rechercher un favori..."
            class="md:col-span-2"
          >
            <template #prefix>
              <SearchIcon class="h-4 w-4 text-gray-400" />
            </template>
          </Input>
          
          <!-- Filtre par statut -->
          <Select
            v-model="filters.status"
            :options="statusFilterOptions"
            placeholder="Tous les statuts"
          />
          
          <!-- Filtre par catégorie -->
          <Select
            v-model="filters.category"
            :options="categoryFilterOptions"
            placeholder="Toutes les catégories"
          />
        </div>
      </div>
      
      <!-- Message d'erreur -->
      <div v-if="error" class="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
        <div class="flex">
          <AlertCircleIcon class="h-5 w-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p class="text-red-700">{{ error }}</p>
            <Button
              variant="link"
              size="sm"
              @click="fetchBookmarks"
              class="mt-2 text-red-600 p-0 h-auto"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </div>
      
      <!-- Message de succès -->
      <div v-if="successMessage" class="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
        <div class="flex">
          <CheckCircleIcon class="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
          <p class="text-green-700">{{ successMessage }}</p>
        </div>
      </div>
      
      <!-- Liste des bookmarks -->
      <div v-if="isLoading && bookmarks.length === 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="n in 6" :key="n" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
          <div class="space-y-3">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-3 bg-gray-200 rounded w-full"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
      
      <div v-else-if="filteredBookmarks.length === 0 && !isLoading" class="text-center py-12">
        <BookmarkIcon class="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          {{ bookmarks.length === 0 ? 'Aucun favori trouvé' : 'Aucun résultat' }}
        </h3>
        <p class="text-gray-500 mb-4">
          {{ 
            bookmarks.length === 0 
              ? 'Commencez par ajouter votre premier favori' 
              : 'Essayez de modifier vos filtres de recherche'
          }}
        </p>
        <Button
          v-if="bookmarks.length === 0"
          @click="showAddModal = true"
        >
          <PlusIcon class="h-4 w-4 mr-2" />
          Ajouter mon premier favori
        </Button>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BookmarkCard
          v-for="bookmark in paginatedBookmarks"
          :key="bookmark.id"
          :bookmark="bookmark"
          @edit="handleEdit"
          @delete="handleDelete"
          @update="handleUpdate"
          @error="handleError"
        />
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex justify-center">
        <nav class="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="currentPage = Math.max(1, currentPage - 1)"
          >
            <ChevronLeftIcon class="h-4 w-4" />
          </Button>
          
          <template v-for="page in visiblePages" :key="page">
            <Button
              v-if="page !== '...'"
              :variant="page === currentPage ? 'default' : 'outline'"
              size="sm"
               @click="typeof page === 'number' && (currentPage = page)"
            >
              {{ page }}
            </Button>
            <span v-else class="px-2 text-gray-500">...</span>
          </template>
          
          <Button
            variant="outline"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
          >
            <ChevronRightIcon class="h-4 w-4" />
          </Button>
        </nav>
      </div>
    </div>
    
    <!-- Modals -->
    <AddBookmarkModal
      :is-open="showAddModal"
      @close="showAddModal = false"
      @success="handleAddSuccess"
    />
    
    <EditBookmarkModal
      :is-open="showEditModal"
      :bookmark="selectedBookmark"
      @close="showEditModal = false"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import {
  PlusIcon,
  RefreshCwIcon,
  SearchIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  BookmarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from 'lucide-vue-next';
import { BookmarkService } from '../services/bookmarkService';
import Input from '../components/commons/Input.vue';
import Select from '../components/commons/Select.vue';
import Button from '../components/commons/Button.vue';
import BookmarkCard from '../components/bookmarks/BookmarkCard.vue';
import AddBookmarkModal from '../components/bookmarks/AddBookmarkModal.vue';
import EditBookmarkModal from '../components/bookmarks/EditBookmarkModal.vue';
import type { Bookmark } from '../types';

// État principal
const bookmarks = ref<Bookmark[]>([]);
const isLoading = ref(false);
const error = ref('');
const successMessage = ref('');

// Modals
const showAddModal = ref(false);
const showEditModal = ref(false);
const selectedBookmark = ref<Bookmark | null>(null);

// Filtres
const filters = ref({
  search: '',
  status: '',
  category: ''
});

// Pagination
const currentPage = ref(1);
const itemsPerPage = 9;

// Options des filtres
const statusFilterOptions = computed(() => [
  { value: '', label: 'Tous les statuts' },
  { value: 'unread', label: 'Non lus' },
  { value: 'reading', label: 'En cours de lecture' },
  { value: 'read', label: 'Lus' }
]);

const categoryFilterOptions = computed(() => {
  const categories = [...new Set(bookmarks.value.map(b => b.category))];
  return [
    { value: '', label: 'Toutes les catégories' },
    ...categories.map(cat => ({ value: cat, label: cat }))
  ];
});

// Bookmarks filtrés
const filteredBookmarks = computed(() => {
  let filtered = [...bookmarks.value];
  
  // Filtre par recherche
  if (filters.value.search.trim()) {
    const searchTerm = filters.value.search.toLowerCase().trim();
    filtered = filtered.filter(bookmark =>
      bookmark.title.toLowerCase().includes(searchTerm) ||
      bookmark.url.toLowerCase().includes(searchTerm) ||
      bookmark.category.toLowerCase().includes(searchTerm)
    );
  }
  
  // Filtre par statut
  if (filters.value.status) {
    filtered = filtered.filter(bookmark => bookmark.status === filters.value.status);
  }
  
  // Filtre par catégorie
  if (filters.value.category) {
    filtered = filtered.filter(bookmark => bookmark.category === filters.value.category);
  }
  
  // Tri par date de création (plus récent en premier)
  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredBookmarks.value.length / itemsPerPage));

const paginatedBookmarks = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredBookmarks.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages: (number | string)[] = [];
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    
    if (current > 4) {
      pages.push('...');
    }
    
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    if (current < total - 3) {
      pages.push('...');
    }
    
    if (total > 1) {
      pages.push(total);
    }
  }
  
  return pages;
});

// Fonctions utilitaires
const showSuccess = (message: string) => {
  successMessage.value = message;
  setTimeout(() => {
    successMessage.value = '';
  }, 5000);
};

const handleError = (message: string) => {
  error.value = message;
  setTimeout(() => {
    error.value = '';
  }, 5000);
};

// Récupérer les bookmarks
const fetchBookmarks = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    bookmarks.value = await BookmarkService.getAllBookmarks();
  } catch (err: any) {
    handleError(err.message || 'Erreur lors de la récupération des favoris');
  } finally {
    isLoading.value = false;
  }
};

// Gestionnaires d'événements des modals
const handleAddSuccess = (newBookmark: Bookmark) => {
  bookmarks.value.unshift(newBookmark);
  showAddModal.value = false;
  showSuccess('Favori ajouté avec succès !');
};

const handleEditSuccess = (updatedBookmark: Bookmark) => {
  const index = bookmarks.value.findIndex(b => b.id === updatedBookmark.id);
  if (index !== -1) {
    bookmarks.value[index] = updatedBookmark;
  }
  showEditModal.value = false;
  selectedBookmark.value = null;
  showSuccess('Favori mis à jour avec succès !');
};

// Gestionnaires des actions sur les bookmarks
const handleEdit = (bookmark: Bookmark) => {
  selectedBookmark.value = bookmark;
  showEditModal.value = true;
};

const handleDelete = async (bookmarkId: number) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce favori ?')) {
    return;
  }
  
  try {
    await BookmarkService.deleteBookmark(bookmarkId);
    bookmarks.value = bookmarks.value.filter(b => b.id !== bookmarkId);
    showSuccess('Favori supprimé avec succès !');
    
    // Ajuster la page courante si nécessaire
    const maxPage = Math.ceil(filteredBookmarks.value.length / itemsPerPage);
    if (currentPage.value > maxPage && maxPage > 0) {
      currentPage.value = maxPage;
    }
  } catch (err: any) {
    handleError(err.message || 'Erreur lors de la suppression du favori');
  }
};

const handleUpdate = (updatedBookmark: Bookmark) => {
  const index = bookmarks.value.findIndex(b => b.id === updatedBookmark.id);
  if (index !== -1) {
    bookmarks.value[index] = updatedBookmark;
  }
};

// Watchers pour réinitialiser la pagination lors des changements de filtres
watch([() => filters.value.search, () => filters.value.status, () => filters.value.category], () => {
  currentPage.value = 1;
}, { deep: true });

// Chargement initial
onMounted(() => {
  fetchBookmarks();
});
</script>