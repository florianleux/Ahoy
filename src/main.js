import Vue from "vue";
import App from "./App.vue";
// Animation classes used by the fight transitions (animate__tada, animate__fadeOut).
import "animate.css";
import router from "./router";
import { Game } from "@/classes/Game.js";
import i18n from "@/plugins/i18n";

Vue.config.productionTip = false;
Vue.prototype.$game = new Game();

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
  render: h => h(App)
}).$mount("#app");
