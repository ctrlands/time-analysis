import Vue from 'vue'
import VueRouter from 'vue-router'

// import Main from "../src/component/main";
// // 下面2行代码，没有指定webpackChunkName，每个组件打包成一个js文件。
// /* const Home = () => import('@/components/home')
// const Index = () => import('@/components/index')
// const About = () => import('@/components/about') */
// // 下面2行代码，指定了相同的webpackChunkName，会合并打包成一个js文件。 把组件按组分块
// // const Home =  () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/home')
// // const Index = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/index')
// // const About = () => import(/* webpackChunkName: 'ImportFuncDemo' */ '@/components/about')
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    meta: {
      title: 'Main'
    },
    name: 'Main',
    component: () => import("@/view/main")
  },
  {
    path: '/echart',
    meta: {
      title: 'echart',
      keepAlive: false
    },
    name: 'echart',
    component: () => import('@/component/echart')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router;
