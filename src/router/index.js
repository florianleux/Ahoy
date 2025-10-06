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
    props: true,
    meta: { bodyClass: "home" }
  },
  {
    path: "/placement",
    name: "Placement",
    component: Placement,
    props: true,
    meta: { bodyClass: "placement" }
  },
  {
    path: "/pre-fight",
    name: "PreFight",
    component: PreFight,
    props: true,
    meta: { bodyClass: "pre-fight" }
  },
  {
    path: "/fight",
    name: "Fight",
    component: Fight,
    props: true,
    meta: { bodyClass: "fight" }
  }
];

const router = new VueRouter({
  routes
});

// Helper function to clean up enemy classes from body
const cleanupEnemyClasses = () => {
  const enemyClasses = ['SimpleSam', 'JackTheBurned', 'MamanBrigitte', 'ChisanaKaizoku', 'Z'];
  enemyClasses.forEach(className => {
    document.body.classList.remove(className);
  });
};

// Helper function to clean up all page classes from body
const cleanupAllPageClasses = () => {
  const pageClasses = ['home', 'placement', 'pre-fight', 'fight'];
  pageClasses.forEach(className => {
    document.body.classList.remove(className);
  });
};

// Navigation guard to set body class
router.beforeEach((to, from, next) => {
  // Remove old body class
  if (from.meta && from.meta.bodyClass) {
    document.body.classList.remove(from.meta.bodyClass);
  }

  // Clean up any enemy classes that might be lingering
  cleanupEnemyClasses();

  // Add new body class
  if (to.meta && to.meta.bodyClass) {
    document.body.classList.add(to.meta.bodyClass);
  }

  next();
});

// Route guards to protect game-related routes
router.beforeEach((to, from, next) => {
  // Routes that require an initialized game
  const protectedRoutes = ["Placement", "PreFight", "Fight"];

  if (protectedRoutes.includes(to.name)) {
    // Check if game is initialized (using global Vue instance)
    if (!window.vueApp || !window.vueApp.$game || !window.vueApp.$game.player) {
      // Clean up all classes before redirecting
      cleanupAllPageClasses();
      cleanupEnemyClasses();
      // Redirect to home if game not initialized
      next({ name: "Home" });
      return;
    }
  }

  next();
});

export default router;
