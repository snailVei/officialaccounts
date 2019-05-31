// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '../static/css/normalize.css';
import api from './api/index.js'
import utils from './utils/index.js'
import store from "./stores/global-store"
import VueWechatTitle from 'vue-wechat-title';

import 'babel-polyfill'
import Es6Promise from 'es6-promise'
require('es6-promise').polyfill()
Es6Promise.polyfill()




//import vConsole from '@/assets/js/vconsole.js'

import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

import {
  Loadmore
} from 'mint-ui';
Vue.component(Loadmore.name, Loadmore);

import VueResource from 'vue-resource'
Vue.use(VueResource)
// Vue.http.options.root = 'http://47.111.185.223:30000/usercenter/'
//Vue.http.options.root = 'http://192.168.1.117:30000/usercenter/'
require('es6-promise').polyfill();
var axios = require('axios')
import Qs from 'qs'

//md5加
import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

//引用ElementUI头像上传
import {
  Upload
} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import {
//   Swipe,
//   SwipeItem
// } from 'vant';
// import 'vant/lib/index.css';
// Vue.use(Swipe).use(SwipeItem);

Vue.use(Upload);

// 引用第三方样式示例（整体引用），可根据项目实际更换
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css';

Vue.use(MintUI);
Vue.use(VueWechatTitle)



Vue.config.productionTip = false


Vue.prototype.$ajax = api
Vue.prototype.$utils = utils

if (process.env.NODE_ENV == "production") {
  axios.defaults.baseURL=process.env.API_HOST
}
if(process.env.NODE_ENV == "development"){
axios.defaults.baseURL = location.protocol + "//" + location.host + process.env.API_HOST
}
// http请求拦截器
axios.interceptors.request.use(config => {
	
  return config;
}, error => {
  return Promise.reject(error)
})

// http响应拦截器
axios.interceptors.response.use(res => { // 响应成功关闭loading
  var that = this;
  // res.data.msg.indexOf("重新登录")!=-1,重新登录根据实际情况处理
  if (res.data.code == 'E003') {
//  utils.checkLogin(that); //todo
    return false;
  }

  return res;
}, error => {
  return Promise.reject(error)
})

/* eslint-disable no-new */


new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
router.beforeEach((to, from, next) => {
  var that = this;
	utils.getShopId();
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  if (to.meta.requireAuth) { //是否需要登录权限
    let token = utils.checkLogin(that);
    if (!token) {
      return false;
    }
  }
  next();
})

router.afterEach(route => {
  // 从路由的元信息中获取 title 属性
  if (route.fullPath.indexOf("token") != -1) {
    store.commit('setData', {
      "refresh": true,
    })
  }

  let deviceInfo = utils.deviceInfo();
  if (deviceInfo == "ios") {
    var i = document.createElement('iframe');
    i.style.display = 'none';
    i.onload = function () {
      setTimeout(function () {
        i.remove();
      }, 500)
    }
    document.body.appendChild(i);
  }
});
