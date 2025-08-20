<template>
  <div class="py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Tableau de bord</h1>
        <p class="text-gray-600">
          Vue d'ensemble de vos favoris et statistiques de lecture
        </p>
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
              @click="fetchStats"
              class="mt-2 text-red-600 p-0 h-auto"
            >
              Réessayer
            </Button>
          </div>
        </div>
      </div>

      <!-- Cartes de statistiques -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total des favoris"
          :value="stats.total"
          :icon="BookmarkIcon"
          color="blue"
          :is-loading="isLoading"
        />
        
        <StatsCard
          title="Favoris lus"
          :value="stats.read"
          :icon="CheckCircleIcon"
          color="green"
          :is-loading="isLoading"
        />
        
        <StatsCard
          title="En cours de lecture"
          :value="stats.reading"
          :icon="ClockIcon"
          color="yellow"
          :is-loading="isLoading"
        />
        
        <StatsCard
          title="Non lus"
          :value="stats.unread"
          :icon="CircleIcon"
          color="red"
          :is-loading="isLoading"
        />
      </div>

      <!-- Contenu principal -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Graphique des catégories -->
        <StatsChart
          :data="stats.byCategory"
          :is-loading="isLoading"
          :error="error"
        />
        
        <!-- Statistiques détaillées -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Top des catégories
          </h3>
          
          <div v-if="isLoading" class="space-y-3">
            <div v-for="n in 5" :key="n" class="animate-pulse">
              <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
            </div>
          </div>
          
          <div v-else-if="stats.byCategory.length === 0" class="text-center py-8">
            <FolderIcon class="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p class="text-gray-500">Aucune catégorie trouvée</p>
          </div>
          
          <div v-else class="space-y-4">
            <div
              v-for="(category, index) in sortedCategories"
              :key="category.category"
              class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: getCategoryColor(index) }"
                ></div>
                <span class="font-medium text-gray-900">{{ category.category }}</span>
              </div>
              
              <div class="text-right">
                <div class="text-lg font-semibold text-gray-900">
                  {{ category.count }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ ((category.count / stats.total) * 100).toFixed(1) }}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            @click="$router.push('/bookmarks')"
            class="flex items-center justify-center p-4 h-auto"
          >
            <BookmarkIcon class="h-5 w-5 mr-2" />
            <div class="text-left">
              <div class="font-medium">Voir tous les favoris</div>
              <div class="text-sm text-gray-500">Gérer votre collection</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            @click="showAddBookmarkModal = true"
            class="flex items-center justify-center p-4 h-auto"
          >
            <PlusIcon class="h-5 w-5 mr-2" />
            <div class="text-left">
              <div class="font-medium">Ajouter un favori</div>
              <div class="text-sm text-gray-500">Nouveau lien rapide</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            @click="fetchStats"
            :loading="isLoading"
            class="flex items-center justify-center p-4 h-auto"
          >
            <RefreshCwIcon class="h-5 w-5 mr-2" />
            <div class="text-left">
              <div class="font-medium">Actualiser</div>
              <div class="text-sm text-gray-500">Mettre à jour les stats</div>
            </div>
          </Button>
        </div>
      </div>
    </div>

    <!-- Modal d'ajout rapide -->
    <AddBookmarkModal
      :is-open="showAddBookmarkModal"
      @close="showAddBookmarkModal = false"
      @success="handleBookmarkAdded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { 
  BookmarkIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  CircleIcon,
  AlertCircleIcon,
  FolderIcon,
  PlusIcon,
  RefreshCwIcon
} from 'lucide-vue-next';
import { StatsService } from '../services/statsService';
import StatsCard from '../components/stats/StatsCard.vue';
import StatsChart from '../components/stats/StatsChart.vue';
import Button from '../components/commons/Button.vue';
import AddBookmarkModal from '../components/bookmarks/AddBookmarkModal.vue';
import type { Stats } from '../types';

// État du composant
const isLoading = ref(false);
const error = ref('');
const showAddBookmarkModal = ref(false);

// Statistiques par défaut
const stats = ref<Stats>({
  total: 0,
  read: 0,
  reading: 0,
  unread: 0,
  byCategory: []
});

// Couleurs pour les catégories
const categoryColors = [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
];

// Catégories triées par count décroissant
const sortedCategories = computed(() => {
  return [...stats.value.byCategory].sort((a, b) => b.count - a.count);
});

// Obtenir la couleur d'une catégorie
const getCategoryColor = (index: number): string => {
  return categoryColors[index % categoryColors.length];
};

// Récupérer les statistiques
const fetchStats = async () => {
  isLoading.value = true;
  error.value = '';
  
  try {
    stats.value = await StatsService.getStats();
  } catch (err: any) {
    error.value = err.message || 'Erreur lors du chargement des statistiques';
  } finally {
    isLoading.value = false;
  }
};

// Gestionnaire d'ajout de favori
const handleBookmarkAdded = () => {
  showAddBookmarkModal.value = false;
  fetchStats(); // Actualiser les statistiques
};

// Chargement initial
onMounted(() => {
  fetchStats();
});
</script>