import Vue from 'vue';

import App from './App.vue';

// import Rx from 'rxjs';
import VueRx from 'vue-rx';

import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueRx);
Vue.use(VueAxios, axios);


import './registerServiceWorker';
// import store from './store'

Vue.config.productionTip = false;
new Vue({
  // store,
  render: h => h(App)
}).$mount('#app');
