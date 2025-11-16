import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({}),
    dts({ insertTypesEntry: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'packages/index.ts'),
      name: 'GcKit',
      fileName: format => `gc-kit.${format}.js`,
      cssFileName: 'style', // 确保CSS文件名为style.css
    },
    rollupOptions: {
      external: ['vue','element-plus','vue-router'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus',
          'vue-router': 'VueRouter',
        }
      }
    },
    cssCodeSplit: false, // 合并所有CSS到一个文件
  }
})
