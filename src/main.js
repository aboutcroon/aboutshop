import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'

import './assets/css/Global.css'

Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
