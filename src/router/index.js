import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'

var routes;

routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    alias: '/home'
  },

  {
    path: '/player/:player_id',
    name: 'player',
    component: () => import('@/views/Player.vue')
  },

  {
    path: '/players',
    name: 'view-players',
    component: () => import('@/views/ViewPlayers.vue')
  },
  {
    path: '/create',
    name: 'create-player',
    component: () => import('@/views/Create.vue')
  },


  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: function () {
      return import("@/views/404.vue");
    },
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router