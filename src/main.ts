import { createApp } from "vue";
import App from "./App.vue";
// Animation classes used by the fight transitions (animate__tada, animate__fadeOut).
import "animate.css";
import router from "./router";
import i18n from "@/plugins/i18n";

// Clean up any residual classes from body on app initialization
const enemyClasses: string[] = [
  "SimpleSam",
  "JackTheBurned",
  "MamanBrigitte",
  "ChisanaKaizoku",
  "Z"
];
const pageClasses: string[] = ["home", "placement", "pre-fight", "fight"];
[...enemyClasses, ...pageClasses].forEach(className => {
  document.body.classList.remove(className);
});

const app = createApp(App);
app.use(router);
app.use(i18n);
app.mount("#app");
