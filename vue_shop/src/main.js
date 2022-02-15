import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
//全局样式表
import "./assets/css/glabal.css"
import TReeTable from 'vue-table-with-tree-grid'
//文本编辑器
import VueQuillEditor from 'vue-quill-editor'
//富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
//导入axios
import axios from 'axios'
//配置请求的根路径  就是前面的前缀 也就是接口的接口基准地址
axios.defaults.baseURL="http://127.0.0.1:8888/api/private/v1/"
//config 请求对象  就是接收的参数 名字可以随意起  简单点接受函数名config
//axios   interceptors.request.use添加请求拦截器  request请求
//interceptors.response.use添加响应拦截器 response响应
axios.interceptors.request.use( config =>{
  console.log(config)
  //API V1 认证统一使用 Token 认证
  //需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
  //打印的config里面请求头名字为headers 我们要为headers添加一个Authorization 里面保存token值 
  // token值 是在Login.vue里面来的
  //window.sessionStorage.getItem('token') 获取window下会话存储的值 他的名字叫token
  //拦截所有请求并且添加请求头 要后台知道是哪个用户请求的 ,并且返回响应的数据给他,就是给相应的权限
  config.headers.Authorization=window.sessionStorage.getItem('token')
  //你获取之后的值Authorization=null 并不是出错了
  //因为你是登录请求,不需要服务器相应,所以服务器没有发送token里面的值 所以为null
  //如果里面的值用的话还要通过JSON.parse()转成对象，得到的null值才不会当成字符串
  //必须return出去 不然外面接受不到
  return config
})
//挂在vue原型对象上
// 给Vue函数添加一个原型属性$axios 指向Axios
//好处是在vue实例或组件中不用再去重复引用Axios 直接用this.$axios就能执行axios 方法了
Vue.prototype.$http=axios
Vue.config.productionTip = false
//注册一个table主键
Vue.component('tree-table', TReeTable)
Vue.use(VueQuillEditor, /* { default global options } */)
//dateFormat他的名字
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  // getFullYear() 方法可返回一个表示年份的 4 位数字。
  const y = dt.getFullYear()
  // getMonth() 方法可返回表示月份的数字但是只有0-11,所以要加一
  //padEnd()用于尾部补全 前面是几位
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  // getDate() 方法可返回月份的某一天。
  const d = (dt.getDate() + '').padStart(2, '0')
  //小时 
  const hh = (dt.getHours() + '').padStart(2, '0')
  //分
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  //秒
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  //进行拼接
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
