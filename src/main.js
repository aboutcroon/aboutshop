import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'

// 导入全局样式表
import './assets/css/Global.css'
// 导入字体图标
import './assets/iconfont/iconfont.css'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 在挂载到原型之前，先弄一个拦截器，携带使得请求头的Authorization中携带token令牌
// request即是请求的拦截器，config是请求对象，headers是请求对象中的请求头，要在请求头中添加Authorization属性
// 然后在登录后，每次发api请求，都会携带这个Authorization属性
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config // 必须返回这个config
})
Vue.prototype.$http = axios // 使得可以直接通过http发起ajax请求

Vue.config.productionTip = false

Vue.component('tree-table', TreeTable) // 全局引入组件

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
