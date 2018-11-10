import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import './registerServiceWorker';

const colors = { primary: '#3A506B', secondary: '#5BC0BE' };

Vue.use(vuetify, {
  theme: {
    primary: colors.primary, // #E53935
    secondary: colors.secondary
  }
});

Vue.config.productionTip = false;
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
