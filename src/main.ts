import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Axios from 'axios';
import vuetify from './plugins/vuetify';
import './styles/app.scss';

Vue.config.productionTip = false;

const baseApiUrl = Axios.create({
  baseURL: "http://40.87.7.157:5001"
});

Vue.prototype.$http = baseApiUrl;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
