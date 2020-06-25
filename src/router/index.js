import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Placement from "../views/Placement.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    props: true,
  },
    {
        path: "/",
        name: "Placement",
        component: Placement,
        props: true,
    },
];

const router = new VueRouter({
  routes
});

export default router;
