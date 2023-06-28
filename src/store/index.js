import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
 
// 挂在Vuex
Vue.use(Vuex)
 
// 创建Vuex对象
const store = new Vuex.Store({
    modules: {
        user
    },
    getters,
})
 
export default store