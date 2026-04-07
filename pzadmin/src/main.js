import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PanelHead from './components/panelHead.vue'
import { useMenuStore } from './store/useMenuStore'

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
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.component('PanelHead', PanelHead)
app.use(pinia)
app.use(router)
app.use(ElementPlus)

const initPersistedTabs = () => {
    const menuStore = useMenuStore()

    // 检查是否为新会话
    const sessionKey = 'pzadmin-session-start'
    if (!sessionStorage.getItem(sessionKey)) {
        // 新会话，清除之前的标签页状态
        menuStore.clearAllTabs()
        sessionStorage.setItem(sessionKey, Date.now().toString())
    }

    const validRoutes = []
    const collectValidRoutes = (routes) => {
        routes.forEach(route => {
            if (route.meta && route.meta.path) {
                validRoutes.push(route.meta)
            }
            if (route.children) {
                collectValidRoutes(route.children)
            }
        })
    }
    collectValidRoutes(router.getRoutes())

    menuStore.cleanupInvalidTabs(validRoutes)
}

router.isReady().then(() => {
    initPersistedTabs()
})

app.mount('#app')