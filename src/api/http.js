import axios from 'axios';
import router from '../router'
import {CODE} from "@/resources/common";
import store from "@/store";

import {Message} from "@element-plus/icons-vue";
import {createApp} from "vue";
import App from "@/App.vue";
axios.defaults.baseURL='/api'
axios.defaults.withCredentials=true
axios.defaults.timeout = 10000000; // 设置超时时间
axios.defaults.withCredentials = true; // 允许跨域



// Content-Type 响应头
axios.defaults.headers.post['Content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.headers.get['Content-type'] = 'application/x-www-form-urlencoded;charset=UTF-8'

// 设置后台访问基础地址











// 是否超时
// 超时逻辑  (当前时间  - 缓存中的时间) 是否大于 时间差
// 响应拦截器
axios.interceptors.response.use(
    response => {
      // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
      // 否则的话抛出错误s
      if (response.status === 200) {
        return Promise.resolve(response)
      } else {
        return Promise.reject(response)
      }
    },
    // 服务器状态码不是2开头的的情况
    error => {
      if (error.response.code) {
        switch (error.response.code) {
            // 401: 未登录
          case 401:
            router.replace({
              path: "/",
              query: {
                // redirect: router.currentRoute.fullPath
              },
            });
            break;
          case 403:
            // console.log('管理员权限已修改请重新登录')
            // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
            setTimeout(() => {
              router.replace({
                path: "/",
                query: {
                  // redirect: router.currentRoute.fullPath
                },
              });
            }, 1000);
            break;

            // 404请求不存在
          case 404:
            // console.log('请求页面飞到火星去了')
            break;
        }
        return Promise.reject(error.response);
      }
    }
)

/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise<unknown>}
 */

export function get(url, params={}) {
  return new Promise((resolve, reject) => {
    // return new promise代表让他异步访问，分为两种结果，resolve和reject
    axios.get(url, params)
        // .then(response =>console.log(response))
        .then(response => resolve(response.data))//获取返回值response并处理返回值
        .catch(error => {reject(error)})
    //获取到异常时对异常进行的处理
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post(url, data ) {
  return new Promise((resolve, reject) => {
    axios.post(url,data ).then(
        response => resolve(response.data),
        error => {console.log("mise");reject(error)}

    );
  });
}

/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function deletesWrapper(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data).then(
        response => resolve(response.data),
        error => reject(error)
    );
  });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
        response => resolve(response.data),
        error => reject(error)
    );
  });
}
