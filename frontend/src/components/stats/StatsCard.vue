<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-gray-600">{{ title }}</p>
        <div class="mt-2 flex items-baseline">
          <p v-if="!isLoading" class="text-2xl font-semibold text-gray-900">
            {{ formattedValue }}
          </p>
          <div v-else class="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
      
      <div :class="[
        'flex items-center justify-center w-12 h-12 rounded-lg',
        iconBackgroundColor
      ]">
        <component :is="icon" :class="['h-6 w-6', iconColor]" />
      </div>
    </div>
    
    <!-- Pourcentage ou tendance (optionnel) -->
    <div v-if="percentage !== undefined" class="mt-4 flex items-center">
      <component 
        :is="percentage >= 0 ? 'TrendingUpIcon' : 'TrendingDownIcon'" 
        :class="[
          'h-4 w-4 mr-1',
          percentage >= 0 ? 'text-green-500' : 'text-red-500'
        ]" 
      />
      <span :class="[
        'text-sm font-medium',
        percentage >= 0 ? 'text-green-600' : 'text-red-600'
      ]">
        {{ Math.abs(percentage) }}%
      </span>
      <span class="text-sm text-gray-500 ml-1">vs mois dernier</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-vue-next';

interface Props {
  title: string;
  value: number;
  icon: any;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  percentage?: number;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  isLoading: false,
});

const formattedValue = computed(() => {
  return props.value.toLocaleString();
});

const iconBackgroundColor = computed(() => {
  const colors = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    yellow: 'bg-yellow-100',
    red: 'bg-red-100',
    purple: 'bg-purple-100',
  };
  return colors[props.color];
});

const iconColor = computed(() => {
  const colors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
  };
  return colors[props.color];
});
</script>