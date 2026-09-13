import { createApp } from "vue";
import App from "./App.vue";
// Animation classes used by the fight transitions (animate__tada, animate__fadeOut).
import "animate.css";
import router from "./router";
import { game } from "@/game.js";
import i18n from "@/plugins/i18n";

// Clean up any residual classes from body on app initialization
const enemyClasses = ['SimpleSam', 'JackTheBurned', 'MamanBrigitte', 'ChisanaKaizoku', 'Z'];
const pageClasses = ['home', 'placement', 'pre-fight', 'fight'];
[...enemyClasses, ...pageClasses].forEach(className => {
  document.body.classList.remove(className);
});

const app = createApp(App);
// Components still read it as this.$game; the import above is what the router
// uses. Both point at the same instance.
app.config.globalProperties.$game = game;
app.use(router);
app.use(i18n);
app.mount("#app");
