import Vue from "vue";
import App from "./App.vue";
import AnimateCSS from "animate.css";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { Game } from "@/classes/Game.js";
import i18n from "@/plugins/i18n";

Vue.config.productionTip = false;
Vue.prototype.$game = new Game();
Vue.use(AnimateCSS);

// Create Vue instance and expose globally for router guards
window.vueApp = new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
