import { createRouter, createWebHistory } from "vue-router";
import { game } from "@/game.js";
import Home from "../views/Home.vue";
import Placement from "../views/Placement.vue";
import Fight from "../views/Fight.vue";
import PreFight from "../views/PreFight.vue";

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
    meta: { bodyClass: "placement", requiresGame: true }
  },
  {
    path: "/pre-fight",
    name: "PreFight",
    component: PreFight,
    props: true,
    meta: { bodyClass: "pre-fight", requiresGame: true }
  },
  {
    path: "/fight",
    name: "Fight",
    component: Fight,
    props: true,
    meta: { bodyClass: "fight", requiresGame: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
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
  // Each route says for itself whether it needs a started game, rather than a
  // list here that has to be kept in step with the routes above.
  if (to.meta.requiresGame) {
    if (!game.player) {
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
