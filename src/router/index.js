import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Game from "../views/Game.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/game", name: "Game", component: Game },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes: routes,
});

export default router;