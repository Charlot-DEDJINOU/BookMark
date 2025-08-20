<template>
  <div
    class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center p-4"
  >
    <div class="max-w-4xl mx-auto text-center">
      <!-- Hero Section -->
      <div class="mb-12">
        <div class="flex justify-center mb-6">
          <div class="p-4 bg-white rounded-full shadow-lg">
            <BookmarkIcon class="h-16 w-16 text-primary-600" />
          </div>
        </div>

        <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Gérez vos favoris
          <span class="text-primary-600">intelligemment</span>
        </h1>

        <p class="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Organisez, catégorisez et suivez vos liens favoris avec une interface intuitive
          et des statistiques détaillées pour optimiser votre productivité.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            @click="$router.push('/login')"
            class="bg-primary-500 hover:bg-primary-700 text-white px-8 py-3"
          >
            <LogInIcon class="h-5 w-5 mr-2" />
            Se connecter
          </Button>

          <Button
            variant="outline"
            size="lg"
            @click="$router.push('/register')"
            class="px-8 py-3"
          >
            <UserPlusIcon class="h-5 w-5 mr-2" />
            Créer un compte
          </Button>
        </div>
      </div>

      <!-- Features Section -->
      <div class="grid md:grid-cols-3 gap-8 mb-12">
        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div
            class="flex items-center justify-center w-12 h-12 bg-primary-100 rounded-lg mb-4 mx-auto"
          >
            <FolderIcon class="h-6 w-6 text-primary-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Organisation simple</h3>
          <p class="text-gray-600">
            Organisez vos liens par catégories et retrouvez-les facilement grâce à un
            système de tags intuitif.
          </p>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div
            class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4 mx-auto"
          >
            <BarChart3Icon class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Statistiques avancées</h3>
          <p class="text-gray-600">
            Suivez vos habitudes de lecture avec des graphiques détaillés et des métriques
            personnalisées.
          </p>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div
            class="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mb-4 mx-auto"
          >
            <StarIcon class="h-6 w-6 text-yellow-600" />
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Suivi de lecture</h3>
          <p class="text-gray-600">
            Marquez vos articles comme lus, en cours de lecture ou à lire pour un suivi
            optimal.
          </p>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Prêt à commencer ?</h2>
        <p class="text-gray-600 mb-6">
          Rejoignez des milliers d'utilisateurs qui organisent déjà leurs favoris
          efficacement.
        </p>
        <Button
          size="lg"
          @click="$router.push('/register')"
          class="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3"
        >
          Créer mon compte gratuitement
          <ArrowRightIcon class="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BookmarkIcon,
  LogInIcon,
  UserPlusIcon,
  FolderIcon,
  BarChart3Icon,
  StarIcon,
  ArrowRightIcon,
} from "lucide-vue-next";
import Button from "../components/commons/Button.vue";
</script>
