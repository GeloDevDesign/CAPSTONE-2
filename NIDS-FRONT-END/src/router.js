import { createRouter, createWebHistory } from 'vue-router';
import api from '../utils/api';

import SystemPage from './components/NIDS.vue';
import LoginPage from './components/loginPage.vue';
import LoginLoading from './components/loginLoading.vue';
import ForgotPasswordPage from './components/forgotPassowordPage.vue';

const routes = [
  { path: '/', name: 'login', component: LoginPage },
  { path: '/forgot', name: 'forgotPassword', component: ForgotPasswordPage },
  {path:'/loading',name:'loading',component:LoginLoading, meta: { requiresAuth: true } },
  { 
    path: '/nids', 
    name: 'nids',
    component: SystemPage, 
    meta: { requiresAuth: true } 
  },
  { path: '/:pathMatch(.*)*', name: 'notFound', redirect: { name: 'login' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 };
  },
});


router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
  
    try {
      const isAuthenticated = await api.get('/registerRoute/isAuth');
      if (isAuthenticated) {
        next();
      } else {
        next({ name: 'login', query: { redirect: to.fullPath } });
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      next({ name: 'login', query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
});

export default router;