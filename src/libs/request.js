// import Vue from 'vue'
import axios from 'axios'
import { VueAxios } from './axios'
// 创建 axios 实例
const baseUrl = ''
axios.defaults.baseURL = baseUrl
const service = axios.create({
  baseURL: baseUrl, // api base_url
  timeout: 6000 // 请求超时时间
})

const err = error => {
  return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(config => {
  return config
}, err)

// response interceptor
service.interceptors.response.use(res => {
  return res.data
}, err)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export { installer as VueAxios, service as axios }
