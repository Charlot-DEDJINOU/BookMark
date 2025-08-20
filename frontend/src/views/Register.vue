<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      <!-- Header -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center space-x-2 mb-6">
          <BookmarkIcon class="h-8 w-8 text-primary-600" />
          <span class="text-2xl font-bold text-gray-900">BookmarkApp</span>
        </router-link>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Créer un compte</h1>
        <p class="text-gray-600">
          Rejoignez-nous pour commencer à organiser vos favoris
        </p>
      </div>
      
      <!-- Formulaire d'inscription -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Nom -->
          <Input
            v-model="form.name"
            type="text"
            label="Nom complet"
            placeholder="Votre nom complet"
            required
            :error="errors.name"
            :disabled="isLoading"
          />
          
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
            hint="Le mot de passe doit contenir au moins 6 caractères"
          />
          
          <!-- Confirmation du mot de passe -->
          <Input
            v-model="form.confirmPassword"
            type="password"
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            required
            :error="errors.confirmPassword"
            :disabled="isLoading"
          />
          
          <!-- Message d'erreur général -->
          <div v-if="generalError" class="bg-red-50 border border-red-200 rounded-md p-3">
            <div class="flex">
              <AlertCircleIcon class="h-5 w-5 text-red-400 mr-2 flex-shrink-0" />
              <p class="text-sm text-red-700">{{ generalError }}</p>
            </div>
          </div>
          
          <!-- Message de succès -->
          <div v-if="successMessage" class="bg-green-50 border border-green-200 rounded-md p-3">
            <div class="flex">
              <CheckCircleIcon class="h-5 w-5 text-green-400 mr-2 flex-shrink-0" />
              <p class="text-sm text-green-700">{{ successMessage }}</p>
            </div>
          </div>
          
          <!-- Bouton d'inscription -->
          <Button
            type="submit"
            class="w-full"
            :loading="isLoading"
            :disabled="!isFormValid"
          >
            <UserPlusIcon class="h-4 w-4 mr-2" />
            Créer mon compte
          </Button>
        </form>
        
        <!-- Lien vers la connexion -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Vous avez déjà un compte ?
            <router-link 
              to="/login" 
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Se connecter
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { 
  BookmarkIcon, 
  UserPlusIcon, 
  AlertCircleIcon, 
  CheckCircleIcon,
  ArrowLeftIcon 
} from 'lucide-vue-next';
import { AuthService } from '../services/authService';
import Input from '../components/commons/Input.vue';
import Button from '../components/commons/Button.vue';

const router = useRouter();

// État du formulaire
const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// État du composant
const isLoading = ref(false);
const generalError = ref('');
const successMessage = ref('');
const errors = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// Validation du formulaire
const isFormValid = computed(() => {
  return form.value.name.trim() !== '' && 
         form.value.email.trim() !== '' && 
         form.value.password.trim() !== '' &&
         form.value.confirmPassword.trim() !== '' &&
         form.value.email.includes('@') &&
         form.value.password.length >= 6 &&
         form.value.password === form.value.confirmPassword;
});

// Réinitialiser les messages
const resetMessages = () => {
  generalError.value = '';
  successMessage.value = '';
  errors.value = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };
};

// Validation locale
const validateForm = () => {
  resetMessages();
  let isValid = true;

  // Validation nom
  if (!form.value.name.trim()) {
    errors.value.name = 'Le nom complet est requis';
    isValid = false;
  } else if (form.value.name.trim().length < 2) {
    errors.value.name = 'Le nom doit contenir au moins 2 caractères';
    isValid = false;
  }

  // Validation email
  if (!form.value.email.trim()) {
    errors.value.email = 'L\'adresse e-mail est requise';
    isValid = false;
  } else if (!form.value.email.includes('@')) {
    errors.value.email = 'L\'adresse e-mail n\'est pas valide';
    isValid = false;
  }

  // Validation mot de passe
  if (!form.value.password.trim()) {
    errors.value.password = 'Le mot de passe est requis';
    isValid = false;
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Le mot de passe doit contenir au moins 6 caractères';
    isValid = false;
  }

  // Validation confirmation mot de passe
  if (!form.value.confirmPassword.trim()) {
    errors.value.confirmPassword = 'La confirmation du mot de passe est requise';
    isValid = false;
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Les mots de passe ne correspondent pas';
    isValid = false;
  }

  return isValid;
};

// Gestionnaire d'inscription
const handleRegister = async () => {
  if (!validateForm()) return;

  isLoading.value = true;
  resetMessages();

  try {
    await AuthService.register({
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      password: form.value.password
    });

    successMessage.value = 'Compte créé avec succès ! Redirection vers la connexion...';
    
    // Redirection vers la page de connexion après 2 secondes
    setTimeout(async () => {
      await router.push('/login');
    }, 2000);

  } catch (error: any) {
    generalError.value = error.message || 'Une erreur est survenue lors de la création du compte';
  } finally {
    isLoading.value = false;
  }
};
</script>