import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import GcKit from '../../packages/index'

const app = createApp(App)
app.use(router)
app.use(GcKit)
app.mount('#app')