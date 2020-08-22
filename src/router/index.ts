import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import HelloGame from '../views/HelloGame.vue';

Vue.use(VueRouter);

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'HelloGame',
    component: HelloGame
  },
  {
    path: '/game',
    name: 'Palet',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = new VueRouter({
  base: process.env.BASE_URL,
  routes
});

export default router;
