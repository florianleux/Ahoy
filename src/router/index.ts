import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";
import { game } from "@/game";
import Home from "../views/Home.vue";
import Placement from "../views/Placement.vue";
import Fight from "../views/Fight.vue";
import PreFight from "../views/PreFight.vue";

const routes: RouteRecordRaw[] = [
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
const cleanupEnemyClasses = (): void => {
  const enemyClasses: string[] = [
    "SimpleSam",
    "JackTheBurned",
    "MamanBrigitte",
    "ChisanaKaizoku",
    "Z"
  ];
  enemyClasses.forEach(className => {
    document.body.classList.remove(className);
  });
};

// Helper function to clean up all page classes from body
const cleanupAllPageClasses = (): void => {
  const pageClasses: string[] = ["home", "placement", "pre-fight", "fight"];
  pageClasses.forEach(className => {
    document.body.classList.remove(className);
  });
};

// Navigation guard to set body class
router.beforeEach((to, from, next) => {
  // Remove old body class
  if (typeof from.meta.bodyClass === "string") {
    document.body.classList.remove(from.meta.bodyClass);
  }

  // Clean up any enemy classes that might be lingering
  cleanupEnemyClasses();

  // Add new body class
  if (typeof to.meta.bodyClass === "string") {
    document.body.classList.add(to.meta.bodyClass);
  }

  next();
});

// Route guards to protect game-related routes
router.beforeEach((to, _from, next) => {
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
