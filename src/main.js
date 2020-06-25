import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { Game } from "@/classes/Game.js";

Vue.config.productionTip = false;
Vue.prototype.$game = new Game();

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
