<template>
  <Modal :is-open="isOpen" title="Ajouter un favori" size="lg" @close="handleClose">
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- URL -->
      <Input
        v-model="form.url"
        type="url"
        label="URL"
        placeholder="https://example.com"
        required
        :error="errors.url"
        :disabled="isLoading"
      />

      <!-- Titre -->
      <Input
        v-model="form.title"
        type="text"
        label="Titre"
        placeholder="Titre du favori"
        required
        :error="errors.title"
        :disabled="isLoading"
      />

      <!-- Catégorie -->
      <Input
        v-model="form.category"
        type="text"
        label="Catégorie"
        placeholder="Design"
        required
        :error="errors.category"
        :disabled="isLoading"
        hint="Utilisez des catégories courtes et descriptives"
      />

      <!-- Statut -->
      <Select
        v-model="form.status"
        label="Statut de lecture"
        :options="statusOptions"
        required
        :error="errors.status"
        :disabled="isLoading"
      />

      <!-- Message d'erreur -->
      <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-md p-3">
        <div class="flex">
          <AlertCircleIcon class="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
          <p class="text-sm text-red-700">{{ generalError }}</p>
        </div>
      </div>
    </form>

    <template #footer>
      <div class="flex justify-end space-x-3">
        <Button variant="outline" @click="handleClose" :disabled="isLoading">
          Annuler
        </Button>

        <Button @click="handleSubmit" :loading="isLoading" :disabled="!isFormValid">
          <PlusIcon class="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { PlusIcon, AlertCircleIcon } from "lucide-vue-next";
import { BookmarkService } from "../../services/bookmarkService";
import Modal from "../../components/commons/Modal.vue";
import Input from "../../components/commons/Input.vue";
import Select from "../../components/commons/Select.vue";
import Button from "../../components/commons/Button.vue";
import type { BookmarkStatus, Bookmark } from "../../types";

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
  success: [bookmark: Bookmark];
}>();

// Formulaire
const form = ref({
  url: "",
  title: "",
  category: "",
  status: "unread" as BookmarkStatus,
});

// État
const isLoading = ref(false);
const generalError = ref("");
const errors = ref({
  url: "",
  title: "",
  category: "",
  status: "",
});

// Options de statut
const statusOptions = [
  { value: "unread", label: "Non lu" },
  { value: "reading", label: "En cours de lecture" },
  { value: "read", label: "Lu" },
];

// Validation du formulaire
const isFormValid = computed(() => {
  return (
    form.value.url.trim() !== "" &&
    form.value.title.trim() !== "" &&
    form.value.category.trim() !== "" &&
    ["read", "reading", "unread"].indexOf(form.value.status) !== -1
  );
});

// Réinitialiser le formulaire
const resetForm = () => {
  form.value = {
    url: "",
    title: "",
    category: "",
    status: "unread",
  };
  errors.value = {
    url: "",
    title: "",
    category: "",
    status: "",
  };
  generalError.value = "";
};

// Validation locale
const validateForm = (): boolean => {
  errors.value = {
    url: "",
    title: "",
    category: "",
    status: "",
  };
  generalError.value = "";

  let isValid = true;

  // Validation URL
  if (!form.value.url.trim()) {
    errors.value.url = "L'URL est requise";
    isValid = false;
  } else {
    try {
      new URL(form.value.url);
    } catch {
      errors.value.url = "L'URL n'est pas valide";
      isValid = false;
    }
  }

  // Validation titre
  if (!form.value.title.trim()) {
    errors.value.title = "Le titre est requis";
    isValid = false;
  } else if (form.value.title.trim().length < 3) {
    errors.value.title = "Le titre doit contenir au moins 3 caractères";
    isValid = false;
  }

  // Validation catégorie
  if (!form.value.category.trim()) {
    errors.value.category = "La catégorie est requise";
    isValid = false;
  } else if (form.value.category.trim().length < 2) {
    errors.value.category = "La catégorie doit contenir au moins 2 caractères";
    isValid = false;
  }

  return isValid;
};

// Soumission du formulaire
const handleSubmit = async () => {
  if (!validateForm()) return;

  isLoading.value = true;

  try {
    const bookmark = await BookmarkService.createBookmark({
      url: form.value.url.trim(),
      title: form.value.title.trim(),
      category: form.value.category.trim().toLowerCase(),
      status: form.value.status,
    });

    emit("success", bookmark);
    resetForm();
  } catch (error: any) {
    generalError.value = error.message || "Erreur lors de l'ajout du favori";
  } finally {
    isLoading.value = false;
  }
};

// Fermer le modal
const handleClose = () => {
  if (!isLoading.value) {
    resetForm();
    emit("close");
  }
};

// Réinitialiser le formulaire quand le modal se ferme
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      setTimeout(resetForm, 300); // Attendre la fin de l'animation
    }
  }
);
</script>
