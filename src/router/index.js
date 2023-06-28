import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/pano',
    component: () => import('@/views/Tour.vue')
  },
  {
    path: '/tour',
    name: 'Tour',
    component: () => import('@/views/Tour.vue')
  },
  {
    path: '/pano',
    name: 'Pano',
    component: () => import('@/views/Pano.vue')
  },
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/test.vue')
  },
  {
    path: '/socket',
    name: 'socket',
    component: () => import('@/views/socket.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/tourview/',
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

router.afterEach(to => {
})

export default router
