import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue({})],
  build: {
    lib: {
      entry: resolve(__dirname, 'packages/index.ts'),
      name: 'GcKit',
      fileName: format => `gc-kit.${format}.js`
    },
    rollupOptions: {
      external: ['vue','element-plus'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
          'element-plus': 'ElementPlus'
        }
      }
    }
  }
})
