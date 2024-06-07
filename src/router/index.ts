import { createRouter, createWebHistory } from "vue-router";
import Home from "@/views/Home.vue";
import Exercise from "@/views/Exercise.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/exercise/:id?",
      name: "exercise",
      component: Exercise
    },
  ]
});

export default router;
