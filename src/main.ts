import 'vuetify/dist/vuetify.min.css'; // Ensure you are using css-loader

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Vuetify from 'vuetify';

Vue.use(Vuetify);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
