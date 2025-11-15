declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // 兼容 Vue 组件的默认导出和内部类型导出
  const component: DefineComponent<any, any, any> & {
    [key: string]: any // 支持组件内部导出的 Props/Emits 类型
  }
  export default component
  export * from '*.vue' // 导出组件内部所有类型
}

// 精准匹配你的组件路径格式：DynamicFiltering/src/index.vue
declare module 'packages/components/*/src/index.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<any, any, any>
  export default component
  export * from 'packages/components/*/src/index.vue'
}