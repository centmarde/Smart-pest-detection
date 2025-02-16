/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from "@/plugins";
import "vue-toastification/dist/index.css";
import { IonicVue } from "@ionic/vue";
import "@ionic/vue/css/core.css";
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";
import router from './router';
import Toast from "vue-toastification";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

const app = createApp(App).use(IonicVue).use(router).use(Toast); // Modify this line

import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);
app.config.warnHandler = () => {}; 

registerPlugins(app)

router.isReady().then(() => {
  app.mount('#app');
});
