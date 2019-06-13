// 这是js入口文件
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
// 路由
import router from './router';
// 可以在js文件中引入styl文件
import 'common/stylus/index.styl';
// Ajax插件vue-resource
import VueResource from 'vue-resource';
// 全局注册VueResource
Vue.use(VueResource);

Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
