const fs = require('fs');
const path = require('path');

// 定义 demo 目录结构
const demoStructure = [
  // 文件夹
  'demo/public',
  'demo/src/components',
  'demo/src/examples/DynamicFiltering', // 示例组件的 Demo 文件夹
  // 文件（路径 + 内容）
  {
    path: 'demo/index.html',
    content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>gc-kit Demo</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>`
  },
  {
    path: 'demo/vite.config.ts',
    content: `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'gc-kit': path.resolve(__dirname, '../packages')
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../demo-dist'),
    base: './'
  },
  server: {
    port: 3000,
    open: true
  }
})`
  },
  {
    path: 'demo/src/App.vue',
    content: `<template>
  <div class="demo-container">
    <header>gc-kit 组件库 Demo</header>
    <main>
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.demo-container {
  padding: 20px;
}
</style>`
  },
  {
    path: 'demo/src/main.ts',
    content: `import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import GcKit from '../../packages/index'

const app = createApp(App)
app.use(router)
app.use(GcKit)
app.mount('#app')`
  },
  {
    path: 'demo/src/router.ts',
    content: `import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/dynamic-filtering'
  },
  {
    path: '/dynamic-filtering',
    name: 'DynamicFiltering',
    component: () => import('./examples/DynamicFiltering/BasicUsage.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router`
  },
  {
    path: 'demo/src/examples/DynamicFiltering/BasicUsage.vue',
    content: `<template>
  <div class="demo-dynamic-filtering">
    <h2>DynamicFiltering 基础用法</h2>
    <DynamicFiltering 
      :options="filterOptions" 
      @change="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const filterOptions = ref([
  { label: '状态', key: 'status', options: ['全部', '启用', '禁用'] },
  { label: '时间', key: 'time', type: 'date' }
])

const handleChange = (values: any) => {
  console.log('筛选值变化：', values)
}
</script>`
  }
];

// 生成目录和文件
function generateDemo() {
  // 先创建所有文件夹
  demoStructure
    .filter(item => typeof item === 'string') // 筛选文件夹路径
    .forEach(folderPath => {
      const fullPath = path.resolve(__dirname, '../', folderPath);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true }); // recursive: true 支持创建多级目录
        console.log(`创建文件夹：${fullPath}`);
      }
    });

  // 再创建所有文件并写入内容
  demoStructure
    .filter(item => typeof item === 'object') // 筛选文件对象
    .forEach(file => {
      const fullPath = path.resolve(__dirname, '../', file.path);
      if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, file.content);
        console.log(`创建文件：${fullPath}`);
      }
    });

  console.log('Demo 目录结构生成完成！');
}

// 执行生成函数
generateDemo();