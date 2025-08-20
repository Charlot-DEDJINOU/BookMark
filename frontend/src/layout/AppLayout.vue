<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar v-if="showNavigation" />

    <main :class="showNavigation ? 'pt-0' : 'pt-0'">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '../components/commons/NavBar.vue';

const route = useRoute();

const showNavigation = computed(() => {
  const authenticatedRoutes = ['dashboard', 'bookmarks'];
  return authenticatedRoutes.includes(route.name as string);
});
</script>