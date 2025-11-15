import { App } from 'vue'
import DynamicFiltering from './components/DynamicFiltering'

// 组件列表
const components = [DynamicFiltering]

// 全局安装方法
const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name as string, component)
  })
}

// 支持按需导入
export { DynamicFiltering }

// 默认导出全局安装方法
export default {
  install
}