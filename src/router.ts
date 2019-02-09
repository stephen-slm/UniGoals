import Vue from 'vue';
import Router from 'vue-router';

import Notifications from './views/Notifications.vue';
import Login from './views/Login.vue';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/notifications',
      name: 'notifications',
      component: Notifications
    }
  ],
  mode: 'history'
});
