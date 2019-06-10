import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入组件
import goods from 'components/goods/goods.vue'
import ratings from 'components/ratings/ratings'
import seller from 'components/seller/seller'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    // 用户进入页面就看到第一个标签的内容，不用点击
    {
      path: '/',
      redirect: '/goods',
      component: goods
    },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    }
  ],
  linkActiveClass: 'active'
})
