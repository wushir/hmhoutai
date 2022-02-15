import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/', 
    redirect:'/login'
  },
  {
    path: '/login',
    name: 'Login',
    component:Login,
  },
  {
    path: '/home',
    name: 'Home',
    component:Home ,
    //重定向
    redirect:'/welcome',
    //子目录路由
    children:[
      {
        path:'/welcome',
         name: 'Welcome',
          component:Welcome ,
        },
      {
        path: '/users',
        name: 'Users',
        component: Users,
      },
      {
        path: '/rights',
        name: 'Rights',
        component: () => import('../components/power/Rights.vue'),
      },
      {
        path: '/roles',
        name: 'Roles',
        component: () => import('../components/power/Roles.vue'),
      },
      {
        path: '/categories',
        name: 'Categories',
        component: () => import('../components/goods/Categories.vue'),
      },
      {
        path: '/params',
        name: 'Params',
        component: () => import('../components/goods/Params.vue'),
      },
      {
        path: '/goods',
        name: 'Goods',
        component: () => import('../components/goods/Goods.vue'),
      },
      {
        path: '/goods/add',
        name: 'Add',
        component: () => import('../components/goods/Add.vue'),
      },
      {
        path: '/orders',
        name: 'Orders',
        component: () => import('../components/Order/Orders.vue'),
      },
      {
        path: '/reports',
        name: 'Reports',
        component: () => import('../components/reports/Report.vue'),
      },
    ]
  },
  ]

  const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes,
  })
export default router