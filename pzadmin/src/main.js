import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import PanelHead from './components/panelHead.vue'

// 前置导航守卫，在页面跳转之前到回调函数中
// router.beforeEach((to, from) => {
//   const token = localStorage.getItem('pz_token')
//   // 非登录页面token不存在
//   if (!token && to.path !== '/login') {
//     return '/login'
//   } else if (token && to.path === '/login') {
//     return '/'
//   } else {
//     return true
//   }
// })

const pinia = createPinia()
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('PanelHead', PanelHead)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')