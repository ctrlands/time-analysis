import Vue from 'vue'
import App from './app'

import moment from 'moment'
import router from '../router/index'

import './uiplugin/uiplugin'
import 'lib-flexible/flexible'

Vue.config.productionTip = false
Vue.prototype._moment = moment

// for devlope
// new Vue({
//   router,
//   render: h => h(App)
// }).$mount('#app')

// for cordova
document.addEventListener('deviceready', function () {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
}, false)
