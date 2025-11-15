import React from "react";
import type { Component } from 'vue';
export type FilterItemType = {
  label: string // 显示的名称
  key: string  // 用于查询参数等
  disableFilter?: boolean // 改变时禁止触发筛选
  default?: FilterValue // 默认值
  disableRouter? : boolean // 禁止存入查询参数
  isDefaultFilter? : boolean // 是否是默认查询项
  component?: Component | PredefineComponentType // 传入组件过着内置组件名称
  props?: object // 需要传入component的参数，会覆盖原有的参数
  routeFormat?: (value: any) => FilterValue // 自定义的url查询参数转换方法
  filterIndex?: number // 用于排序的权重，越小越靠前，未设置时权重值为1000
  group?: string // 分组名称，未设置时为默认分组(默认)
}
export type PredefineComponentType = 'dyf-input' | 'dyf-select' | 'dyf-select-multiple' | 'dyf-cascader'
export type FilterItemsKeyMapType = {
  [key: string]: FilterItemType
}
export type FilterValue = string | number | string[] | undefined | Array<any>
export type showFilterItemType = {
  key: string
  isUsable: boolean // 用于临时控制是否筛选
}
export type DynamicFilteringType = {
  title?: string // 筛选区域的标题,可选,默认为"筛选条件"
  filterItems?: Array<FilterItemType> // 筛选选项配置列表
  onChangeQuery?: boolean  // 是否自动应用查询
}
