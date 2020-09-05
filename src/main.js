import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/element.js'

// 导入全局样式表
import './assets/css/Global.css'
// 导入字体图标
import './assets/iconfont/iconfont.css'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios // 使得可以直接通过http发起ajax请求

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
