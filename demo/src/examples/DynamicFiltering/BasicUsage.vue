<script setup lang="ts">
import {useRouter, useRoute} from "vue-router";
import {reactive} from "vue";
const router = useRouter()
const route = useRoute()
console.log(123, route, router)
const filterItems = reactive<Array<FilterItemType>>([
  {
    label: "版本选择",
    key: "version",
    default: ['123', '123456'],
    component: "dyf-cascader",
    isDefaultFilter: true,
    filterIndex: 0,
    props: {
      placeholder: "请选择版本",
      options: [
        {
          label: "版本1",
          value: "123",
          children: [
            {
              label: "子版本1",
              value: "123456"
            }
          ]
        },
        {
          label: "版本2",
          value: "456",
          children: [
            {
              label: "子版本2",
              value: "456789"
            }
          ]
        }
      ]
    },
    group: '选择相关'
  },
  {
    label: "用户",
    key: "user",
    default: "gsx",
    component: "dyf-select",
    isDefaultFilter: true,
    disableFilter: true,
    filterIndex: 1,
    props: {
      options: [
        {
          label: "张三",
          value: "gsx"
        },
        {
          label: "李四",
          value: "lisi"
        }
      ]
    }
  },
  {
    label: "平台",
    key: "platform",
    default: [1,2,3,4],
    component: "dyf-select-multiple",
    props: {
      placeholder: "请选择平台"
    },
    isDefaultFilter: true,
    filterIndex: 3,
    routeFormat: (value: any) => {
      if(Array.isArray(value)) {
        return value.map((item: any) => parseInt(item))
      }else if(value){
        return [parseInt(value)]
      }else{
        return value
      }
    }
  }
])
</script>
<template>
  <div>
    <DynamicFiltering :filterItems="filterItems" :router='router' :route="route">123</DynamicFiltering>
  </div>
</template>
