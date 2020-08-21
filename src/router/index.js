import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Placement from "../views/Placement.vue";
import Fight from "../views/Fight.vue";
import PreFight from "../views/PreFight.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true
  },
  {
    path: "/",
    name: "Placement",
    component: Placement,
    props: true
  },
  {
    path: "/",
    name: "PreFight",
    component: PreFight,
    props: true
  },
  {
    path: "/",
    name: "Fight",
    component: Fight,
    props: true
  }
];

const router = new VueRouter({
  routes
});

export default router;
