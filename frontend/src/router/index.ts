import { createRouter, createWebHistory } from 'vue-router';
import { AuthService } from '../services/authService';

// Import des composants
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Dashboard from '../views/Dashboard.vue';
import Bookmarks from '../views/Bookmarks.vue';
import AppLayout from '../layout/AppLayout.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresGuest: true }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { requiresGuest: true }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { requiresGuest: true }
    },

    // Routes avec layout (pages authentifiées)
    {
      path: '/app',
      component: AppLayout,
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/app/dashboard'
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: Dashboard,
          meta: { requiresAuth: true }
        },
        {
          path: 'bookmarks',
          name: 'bookmarks',
          component: Bookmarks,
          meta: { requiresAuth: true }
        }
      ]
    },

    {
      path: '/dashboard',
      redirect: '/app/dashboard'
    },
    {
      path: '/bookmarks',
      redirect: '/app/bookmarks'
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = AuthService.isAuthenticated();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({ name: 'login' });
      return;
    }
  }

  if (to.matched.some(record => record.meta.requiresGuest)) {
    if (isAuthenticated) {
      next({ name: 'dashboard' });
      return;
    }
  }

  next();
});

export default router;