import { App } from 'vue'
import TestButton from './components/TestButton/index.vue'
import './styles/index.scss';
// 组件列表
const components = [TestButton]

// 全局安装方法
const install = (app: App): void => {
  components.forEach(component => {
    app.component(component.name as string, component)
  })
}

// 支持按需导入
export { TestButton }

// 默认导出全局安装方法
export default { install }