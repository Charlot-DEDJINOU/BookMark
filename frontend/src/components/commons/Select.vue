<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>
    
    <select
      :id="selectId"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      :class="[
        'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50',
        error ? 'border-red-500 focus:ring-red-500' : '',
        $attrs.class
      ]"
      @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option value="" disabled>{{ placeholder || 'Sélectionner une option' }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
    
    <p v-if="hint && !error" class="mt-1 text-sm text-gray-500">
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface SelectOption {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  options: SelectOption[];
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

const selectId = computed(() => {
  return `select-${Math.random().toString(36).substr(2, 9)}`;
});
</script>