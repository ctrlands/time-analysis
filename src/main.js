import Vue from 'vue'
import App from './app'

import moment from 'moment'
import router from '../router/index'
import store from './store/index'

import './uiplugin/uiplugin'
import 'lib-flexible/flexible'
import '@babel/polyfill'
import './direct/swip'

Vue.config.productionTip = false
Vue.prototype._moment = moment

// for devlope
// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')

// for cordova
document.addEventListener('deviceready', function () {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}, false)
