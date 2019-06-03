import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
Vue.prototype.$http = axios

import Mint from 'mint-ui'
import 'mint-ui/lib/style.css'  // 引入css
Vue.use(Mint)   // 全局使用

import * as setNum from './assets/js/setDec.js'
Vue.prototype.$setNum = setNum

import '../static/js/flexible.js'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
