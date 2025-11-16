import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import GcKit from '@g_christine/gc-kit'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(GcKit)
app.mount('#app')