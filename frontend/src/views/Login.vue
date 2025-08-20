<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center space-x-2 mb-6">
          <BookmarkIcon class="h-8 w-8 text-primary-600" />
          <span class="text-2xl font-bold text-gray-900">BookmarkApp</span>
        </router-link>

        <h1 class="text-2xl font-bold text-gray-900 mb-2">Connexion</h1>
        <p class="text-gray-600">
          Connectez-vous à votre compte pour accéder à vos favoris
        </p>
      </div>

      <!-- Formulaire de connexion -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <Input
            v-model="form.email"
            type="email"
            label="Adresse e-mail"
            placeholder="votre@email.com"
            required
            :error="errors.email"
            :disabled="isLoading"
          />

          <!-- Mot de passe -->
          <Input
            v-model="form.password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            required
            :error="errors.password"
            :disabled="isLoading"
          />

          <!-- Message d'erreur général -->
          <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-md p-3">
            <div class="flex">
              <AlertCircleIcon class="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
              <p class="text-sm text-red-700">{{ generalError }}</p>
            </div>
          </div>

          <!-- Bouton de connexion -->
          <Button
            type="submit"
            class="w-full"
            :loading="isLoading"
            :disabled="!isFormValid"
          >
            <LogInIcon class="h-4 w-4 mr-2" />
            Se connecter
          </Button>
        </form>

        <!-- Lien vers l'inscription -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Vous n'avez pas encore de compte ?
            <router-link
              to="/register"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Créer un compte
            </router-link>
          </p>
        </div>
      </div>

      <!-- Retour à l'accueil -->
      <div class="mt-6 text-center">
        <router-link
          to="/"
          class="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon class="h-4 w-4 mr-1" />
          Retour à l'accueil
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { BookmarkIcon, LogInIcon, AlertCircleIcon, ArrowLeftIcon } from "lucide-vue-next";
import { AuthService } from "../services/authService";
import Input from "../components/commons/Input.vue";
import Button from "../components/commons/Button.vue";

const router = useRouter();

// État du formulaire
const form = ref({
  email: "",
  password: "",
});

// État du composant
const isLoading = ref(false);
const generalError = ref("");
const errors = ref({
  email: "",
  password: "",
});

// Validation du formulaire
const isFormValid = computed(() => {
  return (
    form.value.email.trim() !== "" &&
    form.value.password.trim() !== "" &&
    form.value.email.includes("@")
  );
});

// Réinitialiser les erreurs
const resetErrors = () => {
  generalError.value = "";
  errors.value = {
    email: "",
    password: "",
  };
};

// Validation locale
const validateForm = () => {
  resetErrors();
  let isValid = true;

  // Validation email
  if (!form.value.email.trim()) {
    errors.value.email = "L'adresse e-mail est requise";
    isValid = false;
  } else if (!form.value.email.includes("@")) {
    errors.value.email = "L'adresse e-mail n'est pas valide";
    isValid = false;
  }

  // Validation mot de passe
  if (!form.value.password.trim()) {
    errors.value.password = "Le mot de passe est requis";
    isValid = false;
  } else if (form.value.password.length < 6) {
    errors.value.password = "Le mot de passe doit contenir au moins 6 caractères";
    isValid = false;
  }

  return isValid;
};

// Gestionnaire de connexion
const handleLogin = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  resetErrors();

  try {
    await AuthService.login({
      email: form.value.email.trim(),
      password: form.value.password,
    });

    // Redirection vers le tableau de bord
    await router.push("/dashboard");
  } catch (error: any) {
    generalError.value = error.message || "Une erreur est survenue lors de la connexion";
  } finally {
    isLoading.value = false;
  }
};
</script>
