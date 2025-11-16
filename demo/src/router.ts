// demo/src/router.ts
import {createRouter, createWebHashHistory, RouteRecordRaw, useRoute, useRouter} from 'vue-router' // 导入 RouteRecordRaw

// 显式指定 routes 为 RouteRecordRaw 数组
const routes: RouteRecordRaw[] = [ // 关键：添加 : RouteRecordRaw[] 类型
  {
    path: '/',
    redirect: '/test-button' // redirect 指向正确的路径
  },
  {
    path: '/test-button',
    name: 'TestButton',
    // 确保组件导入路径正确（相对路径或别名）
    component: () => import('./examples/TestButton.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router