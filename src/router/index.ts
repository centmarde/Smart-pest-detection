import { createRouter, createWebHistory } from '@ionic/vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import { useToast } from 'vue-toastification';

import Hero from '@/pages/Index.vue';
import Home from '@/pages/Home.vue';
import NotFound from '@/pages/NotFound.vue';
import Admin from '@/pages/Admin.vue';
import Profiles from '@/pages/Profiles.vue';
import LoginForm from '@/components/auth/LoginForm.vue';
// @ts-ignore
import Scan from '@/pages/Scan.vue';
import Result from '@/pages/Result.vue';
import ScanHistory from '@/components/views/ScanHistory.vue';

const toast = useToast();

const routes = setupLayouts([
  { path: '/', component: Hero },
  { path: '/home', component: Home, name: 'Home', meta: { requiresAuth: true } },
  { path: '/admin', component: Admin, name: 'Admin', meta: { requiresAuth: true } },
  { path: '/profiles', component: Profiles, name: 'Profiles', meta: { requiresAuth: true } },
  { path: '/scan', component: Scan, name: 'Scan', meta: { requiresAuth: true } },
  { path: '/result', component: Result, name: 'Result', meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', component: NotFound, name: 'NotFound' },
  { path: '/:login', component: LoginForm, name: 'Login'},
  {path: '/scan-history', component: ScanHistory, name: 'ScanHistory', meta: { requiresAuth: true }},
]);

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("access_token") !== null;
  const publicPages = ["/"];
  const protectedPages = ["/home", "/admin", "/profiles"];

  if (to.meta.requiresAuth && !isLoggedIn) {
    toast.error("Authentication is required to access this page.");
    return next("/");
  }

  if (publicPages.includes(to.path) && isLoggedIn) {
    return next("/home");
  }

  next();
});

router.onError((err, to) => {
  if (err?.message?.includes?.("Failed to fetch dynamically imported module")) {
    if (!localStorage.getItem("vuetify:dynamic-reload")) {
      console.log("Reloading page to fix dynamic import error");
      localStorage.setItem("vuetify:dynamic-reload", "true");
      location.assign(to.fullPath);
    } else {
      console.error("Dynamic import error, reloading page did not fix it", err);
    }
  } else {
    console.error(err);
  }
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

export default router;
