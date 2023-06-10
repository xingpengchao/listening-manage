import {createApp, render} from 'vue'
import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store'
import ElementPlus from "element-plus"
import VueCookies from 'vue-cookies'
import Cookie from 'js-cookie'


// 引入组件的汉化
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import "element-plus/dist/index.css"
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import "./assets/css/main.css"

import {State} from "@vue/runtime-core";
import { Storne } from "vuex";
import declare from "declare";
import {getToken,setToken,removeToken} from '@/utils/cookie'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
const cors = require("cors");
app.use(cors); //使用cors中间件
// 组件汉化
app.use(ElementPlus, {locale: zhCn})
app.use(store)
app.use(router)
router.beforeEach((to,from,next)=> {
  //改，可能后端没有返回token
  const token = Cookie.get('token')
  if (!token &&to.name!=='login') {
    //token不存在，则为未登录
    next({name: 'login'})}
  else {
    next();
  }
})
app.use(VueCookies)



app.mount('#app')




const debounce = (fn, delay) => {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      fn.apply(context, args);
    }, delay);
  }
}

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver{
  constructor(callback) {
    callback = debounce(callback, 16);
    super(callback);
  }
}



