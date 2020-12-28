import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HelloGame from '../views/HelloGame.vue';
import Waiting from '../views/Waiting.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'HelloGame',
    component: HelloGame
  },
  {
    path: '/waiting',
    name: 'Waiting',
    component: Waiting
  }
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;
