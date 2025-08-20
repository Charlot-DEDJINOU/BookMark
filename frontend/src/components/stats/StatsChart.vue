<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Répartition par catégorie</h3>
    
    <div v-if="isLoading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent"></div>
    </div>
    
    <div v-else-if="error" class="text-center text-red-600 py-8">
      <AlertCircleIcon class="h-12 w-12 mx-auto mb-2 opacity-50" />
      <p>{{ error }}</p>
    </div>
    
    <div v-else-if="chartData.labels.length === 0" class="text-center text-gray-500 py-8">
      <PieChartIcon class="h-12 w-12 mx-auto mb-2 opacity-50" />
      <p>Aucune donnée à afficher</p>
    </div>
    
    <div v-else class="relative">
      <!-- Canvas pour le graphique -->
      <div class="h-64 flex items-center justify-center">
        <canvas ref="chartCanvas" width="400" height="256"></canvas>
      </div>
      
      <!-- Légende personnalisée -->
      <div class="mt-4 grid grid-cols-2 gap-2">
        <div
          v-for="(item, index) in chartData.labels"
          :key="item"
          class="flex items-center text-sm"
        >
          <div
            :style="{ backgroundColor: chartData.backgroundColor[index] }"
            class="w-3 h-3 rounded-full mr-2 flex-shrink-0"
          ></div>
          <span class="text-gray-700 truncate">{{ item }} ({{ chartData.data[index] }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { 
  Chart, 
  DoughnutController, 
  ArcElement, 
  Tooltip, 
  Legend,
  type ChartConfiguration,
  type ChartOptions
} from 'chart.js';
import { AlertCircleIcon, PieChartIcon } from 'lucide-vue-next';
import type { CategoryStat } from '../../types';

// Enregistrement des composants Chart.js nécessaires
Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

interface Props {
  data: CategoryStat[];
  isLoading?: boolean;
  error?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  error: '',
});

const chartCanvas = ref<HTMLCanvasElement>();
let chartInstance: Chart<'doughnut'> | null = null;

// Couleurs prédéfinies pour le graphique
const colors = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
];

const chartData = ref({
  labels: [] as string[],
  data: [] as number[],
  backgroundColor: [] as string[],
});

const prepareChartData = () => {
  if (!props.data || props.data.length === 0) {
    chartData.value = { labels: [], data: [], backgroundColor: [] };
    return;
  }

  chartData.value = {
    labels: props.data.map(item => item.category),
    data: props.data.map(item => item.count),
    backgroundColor: props.data.map((_, index) => colors[index % colors.length]),
  };
};

const createChart = async () => {
  // Attendre que le DOM soit mis à jour
  await nextTick();
  
  if (!chartCanvas.value || chartData.value.labels.length === 0) {
    console.log('Canvas ou données manquantes');
    return;
  }

  // Détruire l'ancien graphique s'il existe
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  // Définir explicitement la taille du canvas
  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) {
    console.log('Impossible d\'obtenir le contexte 2D');
    return;
  }

  console.log('Création du graphique...');

  // Configuration avec le bon typage pour doughnut
  const config: ChartConfiguration<'doughnut'> = {
    type: 'doughnut',
    data: {
      labels: chartData.value.labels,
      datasets: [{
        data: chartData.value.data,
        backgroundColor: chartData.value.backgroundColor,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverBorderWidth: 3,
        hoverBorderColor: '#ffffff',
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false, // Utiliser notre légende personnalisée
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = context.parsed;
              const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      // cutout est maintenant correctement typé pour doughnut
      cutout: '60%',
      elements: {
        arc: {
          borderWidth: 0
        }
      },
      interaction: {
        intersect: false,
      },
      animation: {
        animateRotate: true,
        animateScale: true
      }
    } as ChartOptions<'doughnut'>
  };

  try {
    chartInstance = new Chart(ctx, config);
    console.log('Graphique créé avec succès');
  } catch (error) {
    console.error('Erreur lors de la création du graphique:', error);
  }
};

const updateChart = () => {
  if (!chartInstance) return;

  chartInstance.data.labels = chartData.value.labels;
  chartInstance.data.datasets[0].data = chartData.value.data;
  chartInstance.data.datasets[0].backgroundColor = chartData.value.backgroundColor;
  chartInstance.update();
};

onMounted(async () => {
  prepareChartData();
  await createChart();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }
});

watch(() => props.data, async () => {
  prepareChartData();
  if (chartInstance) {
    updateChart();
  } else {
    await createChart();
  }
}, { deep: true });

watch(() => chartCanvas.value, async (newVal) => {
  if (newVal && chartData.value.labels.length > 0 && !chartInstance) {
    await createChart();
  }
});
</script>