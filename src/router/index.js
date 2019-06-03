import Vue from 'vue'
import Router from 'vue-router'
import shopCart from '@/components/shopCart'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'shopCart',
      component: shopCart
    }
  ]
})
