import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HelloGame from '../views/HelloGame.vue';
import Palet from '../views/Palet.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'HelloGame',
    component: HelloGame
  },
  {
    path: '/palet',
    name: 'Palet',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Palet
  }
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;
