<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative"
  >
    <!-- Header avec titre et actions -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1 min-w-0">
        <h3 class="text-lg font-semibold text-gray-900 truncate">
          {{ bookmark.title }}
        </h3>
        <a
          :href="bookmark.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-primary-600 hover:text-primary-700 text-sm break-all"
        >
          {{ bookmark.url }}
          <ExternalLinkIcon class="inline h-3 w-3 ml-1" />
        </a>
      </div>

      <!-- Menu d'actions -->
      <div class="relative ml-4">
        <button
          @click="toggleDropdown"
          class="p-1 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <MoreVerticalIcon class="h-5 w-5" />
        </button>

        <!-- Dropdown -->
        <Teleport to="body">
          <div
            v-if="showDropdown"
            v-click-outside="closeDropdown"
            class="absolute bg-white rounded-md shadow-lg border border-gray-200 z-50 w-48"
            :style="dropdownStyle"
          >
            <div class="py-1">
              <button
                @click="handleEdit"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <BedIcon class="h-4 w-4 mr-3" />
                Modifier
              </button>

              <button
                v-if="bookmark.status !== 'read'"
                @click="handleMarkAsRead"
                :disabled="isUpdating"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center disabled:opacity-50"
              >
                <CheckIcon class="h-4 w-4 mr-3" />
                Marquer comme lu
              </button>

              <button
                @click="handleDelete"
                :disabled="isDeleting"
                class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center disabled:opacity-50"
              >
                <TrashIcon class="h-4 w-4 mr-3" />
                Supprimer
              </button>
            </div>
          </div>
        </Teleport>
      </div>
    </div>

    <!-- Informations -->
    <div class="flex items-center justify-between">
      <!-- Catégorie et statut -->
      <div class="flex items-center space-x-3">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          <FolderIcon class="h-3 w-3 mr-1" />
          {{ bookmark.category }}
        </span>

        <span
          :class="[
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
            statusClasses[bookmark.status],
          ]"
        >
          <component :is="statusIcons[bookmark.status]" class="h-3 w-3 mr-1" />
          {{ statusLabels[bookmark.status] }}
        </span>
      </div>

      <!-- Date -->
      <span class="text-xs text-gray-500">
        {{ formatDate(bookmark.created_at) }}
      </span>
    </div>

    <!-- Loader pour les actions -->
    <div
      v-if="isUpdating || isDeleting"
      class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg"
    >
      <div
        class="animate-spin rounded-full h-6 w-6 border-2 border-primary-600 border-t-transparent"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import {
  ExternalLinkIcon,
  MoreVerticalIcon,
  BedIcon,
  CheckIcon,
  TrashIcon,
  FolderIcon,
  CircleIcon,
  ClockIcon,
  CheckCircleIcon,
} from "lucide-vue-next";
import { BookmarkService } from "../../services/bookmarkService";
import type { Bookmark, BookmarkStatus } from "../../types";

interface Props {
  bookmark: Bookmark;
}

interface HTMLElementWithHandler extends HTMLElement {
  _clickOutsideHandler?: (event: Event) => void;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  edit: [bookmark: Bookmark];
  delete: [id: number];
  update: [bookmark: Bookmark];
  error: [message: string];
}>();

// État local
const showDropdown = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const dropdownButtonRef = ref<HTMLElement>();

// Configuration des statuts
const statusLabels: Record<BookmarkStatus, string> = {
  unread: "Non lu",
  reading: "En cours",
  read: "Lu",
};

const statusClasses: Record<BookmarkStatus, string> = {
  unread: "bg-red-100 text-red-800",
  reading: "bg-yellow-100 text-yellow-800",
  read: "bg-green-100 text-green-800",
};

const statusIcons: Record<BookmarkStatus, any> = {
  unread: CircleIcon,
  reading: ClockIcon,
  read: CheckCircleIcon,
};

// Position du dropdown
const dropdownStyle = computed(() => {
  if (!dropdownButtonRef.value) return {};
  
  const rect = dropdownButtonRef.value.getBoundingClientRect();
  return {
    top: `${rect.bottom + window.scrollY + 8}px`,
    right: `${window.innerWidth - rect.right - window.scrollX}px`,
  };
});

// Directive pour cliquer à l'extérieur (avec types corrects)
const vClickOutside = {
  mounted(el: HTMLElementWithHandler, binding: any) {
    el._clickOutsideHandler = (event: Event) => {
      if (!(el === event.target || el.contains(event.target as Node))) {
        binding.value();
      }
    };
    document.addEventListener("click", el._clickOutsideHandler);
  },
  unmounted(el: HTMLElementWithHandler) {
    if (el._clickOutsideHandler) {
      document.removeEventListener("click", el._clickOutsideHandler);
    }
  },
};

// Formatage de date corrigé
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Normaliser les dates à minuit pour une comparaison correcte
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const diffTime = nowOnly.getTime() - dateOnly.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Aujourd'hui";
  } else if (diffDays === 1) {
    return "Hier";
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jours`;
  } else {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  }
};

// Gestion du dropdown
const toggleDropdown = async (event: Event) => {
  event.stopPropagation();
  dropdownButtonRef.value = event.target as HTMLElement;
  showDropdown.value = !showDropdown.value;
  
  if (showDropdown.value) {
    await nextTick();
  }
};

const closeDropdown = () => {
  showDropdown.value = false;
};

// Actions
const handleEdit = () => {
  closeDropdown();
  emit("edit", props.bookmark);
};

const handleMarkAsRead = async () => {
  closeDropdown();
  isUpdating.value = true;

  try {
    await BookmarkService.markAsRead(props.bookmark.id);
    const updatedBookmark = { ...props.bookmark, status: "read" as BookmarkStatus };
    emit("update", updatedBookmark);
  } catch (error: any) {
    emit("error", error.message || "Erreur lors du marquage comme lu");
  } finally {
    isUpdating.value = false;
  }
};

const handleDelete = async () => {
  closeDropdown();

  if (!confirm("Êtes-vous sûr de vouloir supprimer ce favori ?")) {
    return;
  }

  isDeleting.value = true;

  try {
    await BookmarkService.deleteBookmark(props.bookmark.id);
    emit("delete", props.bookmark.id);
  } catch (error: any) {
    emit("error", error.message || "Erreur lors de la suppression");
  } finally {
    isDeleting.value = false;
  }
};
</script>