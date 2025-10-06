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

// Clean up any residual classes from body on app initialization
const enemyClasses = ['SimpleSam', 'JackTheBurned', 'MamanBrigitte', 'ChisanaKaizoku', 'Z'];
const pageClasses = ['home', 'placement', 'pre-fight', 'fight'];
[...enemyClasses, ...pageClasses].forEach(className => {
  document.body.classList.remove(className);
});

// Create Vue instance and expose globally for router guards
window.vueApp = new Vue({
  i18n,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
