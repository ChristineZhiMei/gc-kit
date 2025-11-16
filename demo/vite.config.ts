// demo/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  root: path.resolve(__dirname), // 关键：指定 Demo 的根目录为 demo 文件夹
  base: './',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 基于 demo 目录解析 @ 别名
      'gc-kit': path.resolve(__dirname, '../packages')
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../demo-dist'),
  },
  server: {
    port: 3000,
    open: true
  }
})