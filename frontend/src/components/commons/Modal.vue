<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-y-auto"
      @click="handleBackdropClick"
    >
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-[#000000BF]" />
      
      <!-- Modal -->
      <div class="flex min-h-full items-center justify-center p-4">
        <div
          ref="modalRef"
          :class="[
            'relative w-full max-w-md transform overflow-hidden rounded-lg bg-white shadow-xl transition-all',
            sizeClasses
          ]"
          @click.stop
        >
          <!-- Header -->
          <div v-if="title || $slots.header" class="flex items-center justify-between p-6 pb-4">
            <div>
              <h3 v-if="title" class="text-lg font-semibold text-gray-900">
                {{ title }}
              </h3>
              <slot name="header" />
            </div>
            
            <button
              v-if="showClose"
              @click="$emit('close')"
              class="rounded-md p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <XIcon class="h-5 w-5" />
            </button>
          </div>
          
          <!-- Body -->
          <div class="px-6 py-4">
            <slot />
          </div>
          
          <!-- Footer -->
          <div v-if="$slots.footer" class="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { XIcon } from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showClose?: boolean;
  closeOnBackdrop?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  showClose: true,
  closeOnBackdrop: true,
});

const emit = defineEmits<{
  close: [];
}>();

const modalRef = ref<HTMLElement>();

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };
  return sizes[props.size];
});

const handleBackdropClick = () => {
  if (props.closeOnBackdrop) {
    emit('close');
  }
};

// Gérer le focus lorsque la modal s'ouvre
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    modalRef.value?.focus();
  }
});

// Gérer la touche Escape
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    emit('close');
  }
};

// Ajouter/supprimer l'écouteur d'événements
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.addEventListener('keydown', handleKeydown);
    document.body.style.overflow = 'hidden';
  } else {
    document.removeEventListener('keydown', handleKeydown);
    document.body.style.overflow = '';
  }
});
</script>