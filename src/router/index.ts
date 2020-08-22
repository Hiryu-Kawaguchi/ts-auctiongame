import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HelloGame from '../views/HelloGame.vue';
import Waiting from '../views/Waiting.vue';
// import Palet from '../views/Palet.vue';

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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Waiting
  }
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;
