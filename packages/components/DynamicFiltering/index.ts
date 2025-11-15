import { App } from 'vue'
import DynamicFiltering from './src/index.vue'

DynamicFiltering.install = (app: App) => {
  app.component(DynamicFiltering.name as string, DynamicFiltering)
}

// 默认导出组件
export default DynamicFiltering

// 导出组件的类型
export * from './src/index.vue'
