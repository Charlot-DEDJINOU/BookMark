<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
      sizeClasses,
      variantClasses,
      $attrs.class
    ]"
    :disabled="loading || disabled"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <div
      v-if="loading"
      class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
  loading?: boolean;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'default',
  loading: false,
  disabled: false,
});

defineEmits<{
  click: [event: MouseEvent];
}>();

const sizeClasses = computed(() => {
  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
    lg: 'h-11 rounded-md px-8'
  };
  return sizes[props.size];
});

const variantClasses = computed(() => {
  const variants = {
    default: 'bg-primary-600 text-white hover:bg-primary-700',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    ghost: 'hover:bg-gray-100 text-gray-900',
    link: 'text-primary-600 underline-offset-4 hover:underline'
  };
  return variants[props.variant];
});
</script>