<script setup lang="ts">
import { ref, computed, watch} from 'vue'
import _ from "lodash";
import {useRouter, useRoute} from "vue-router";
import {
  FilterItemType,
  FilterItemsKeyMapType,
  FilterValue,
  showFilterItemType,
  DynamicFilteringType
} from "./types/DynamicFiltering"
import {Filter, RefreshRight} from "@element-plus/icons-vue";
import PredefineFiltering from "./components/PredefineFiltering.vue";
import {pinyin} from "pinyin-pro";
const router = useRouter()
const route = useRoute()
defineOptions({
  name: 'DynamicFiltering' // 组件名称，必须是字符串
})
const emit = defineEmits<{
  (e: 'change', value: { requestForms: Record<string, FilterValue>, nonRequestForms: Record<string, FilterValue> }): void
  (e: 'applyFiltering', value: Record<string, FilterValue>): void
  (e: 'applyNonFiltering', value: Record<string, FilterValue>): void
}>()
const props = withDefaults(defineProps<DynamicFilteringType>(), {
  title: "筛选条件",
  filterItems: () => [],
  onChangeQuery: false
})
export type DynamicFilteringProps = typeof props
export type DynamicFilteringEmits = typeof emit
/* 筛选区域控制 */
// 控制筛选区域的显隐
const isFilterOpen = ref<boolean>(true)
// 控制筛选区域的显隐方法
const setFilterShow = (isOpen: boolean = !isFilterOpen.value): void => {
  isFilterOpen.value = isOpen
}
/*--*/
/* 筛选项存储 | 表单数据存储及方法 */
// 触发筛选的数据
// 将按照key映射对应配置
const FilterItemsKeyMap = computed<FilterItemsKeyMapType>(() => {
  return props.filterItems.reduce((acc: FilterItemsKeyMapType, item: FilterItemType) => {
    acc[item.key] = item
    return acc
  }, {})
})
// 所有需要同步查询参数的key
const syncFilterRoute = computed<string[]>(() => {
  return props.filterItems.reduce((acc: string[], item: FilterItemType) => {
    if (!item.disableRouter) {
      acc.push(item.key);
    }
    return acc
  }, [])
})
// 存储选择显示的筛选项
const showFilterItems = ref<showFilterItemType[]>([]);
// 按照权重排序
const sortedShowFilterItems = computed<showFilterItemType[]>(() => {
  return [...showFilterItems.value].sort((a, b) => {
    const aIndex = FilterItemsKeyMap.value[a.key].filterIndex ?? 1000;
    const bIndex = FilterItemsKeyMap.value[b.key].filterIndex ?? 1000;
    return aIndex - bIndex;
  });
})
// 映射
const showFilterItemsMap = computed<{ [key: string]: showFilterItemType }>(() => {
  return showFilterItems.value.reduce((acc, item) => {
    acc[item.key] = item
    return acc
  }, {} as { [key: string]: showFilterItemType })
});
// 初始化显示的筛选项，先读取url参数，若url参数不存在则用本地存储中获取，若为空则去读取筛选配置
(() => {
  // 有查询参数的时候按照查询参数以及syncFilterRoute
  if(Object.keys(route.query).length !== 0){
    showFilterItems.value = Object.keys(route.query).reduce((acc: showFilterItemType[], item:string) => {
      if(syncFilterRoute.value.includes(item)){
        acc.push({
          key: item,
          isUsable: true
        })
      }
      return acc
    }, [])
  }else{
    // const temp = JSON.parse(sessionStorage.getItem('filter-items') || '[]')
    // if(Array.isArray(temp)) {
    //   showFilterItems.value = temp
    // }
  }
})();
// 选择显示的筛选项
// watch(showFilterItems, () => {
//   sessionStorage.setItem('filter-items', JSON.stringify(showFilterItems.value))
// }, {deep: true})
// 会触发筛选的数据，可能仅改变route查询参数
const requestForms = ref<Record<string, FilterValue>>({})
// 不会触发筛选的数据，可能仅改变route查询参数
const nonRequestForms = ref<Record<string, FilterValue>>({});
// 返回能够使用的查询参数转换方法
const useRouteFormat = (routeFormat: Function | undefined) => {
  if(typeof routeFormat === 'function') {
    return routeFormat
  }else{
    return (value: any) => value
  }
}
// 当筛选项为空时从配置中读默认配置加入
(() => {
  if(showFilterItems.value.length ===  0){
    const query = route.query
    props.filterItems.forEach((filterItem: FilterItemType) => {
      // 根据disableFilter判断存入哪个表单, 根据isDefaultFilter判断是否存入
      if(filterItem.isDefaultFilter){
        if(filterItem?.disableFilter){
          nonRequestForms.value[filterItem.key] = query[filterItem.key] ? useRouteFormat(filterItem.routeFormat)(query[filterItem.key]) : filterItem.default
        }else{
          requestForms.value[filterItem.key] = query[filterItem.key] ? useRouteFormat(filterItem.routeFormat)(query[filterItem.key]) : filterItem.default
        }
        showFilterItems.value.push({
          key: filterItem.key,
          isUsable: true,
        })
      }
    })
  }else{
    const query = route.query
    showFilterItems.value.forEach((filterItem: showFilterItemType) => {
      const temp = FilterItemsKeyMap.value[filterItem.key]
      if(temp?.disableFilter){
        nonRequestForms.value[temp.key] = query[temp.key] ? useRouteFormat(temp.routeFormat)(query[temp.key]) : temp.default
      }else{
        requestForms.value[temp.key] = query[temp.key] ? useRouteFormat(temp.routeFormat)(query[temp.key]) : temp.default
      }
    })
  }
})()
// 获取所有的筛选数据
const getForms = () => {
  return {
    ..._.cloneDeep(requestForms.value),
    ..._.cloneDeep(nonRequestForms.value)
  }
}
// 设置筛选数据的值
const setForms = (key: string, value: FilterValue): void => {
  // 通过配置映射判断是否是触发筛选的key
  if(FilterItemsKeyMap.value?.[key]?.disableFilter){
    requestForms.value[key] = value
  }else{
    nonRequestForms.value[key] = value
  }
}
/* 应用查询控制 */
const emitChange = (r:Record<string, FilterValue>, n:Record<string, FilterValue>) => {
  emit('change', { requestForms: r, nonRequestForms: n })
  const query:Record<string, FilterValue> = {}
  // 空数组时转换为空字符串防止丢失查询参数导致筛选条件丢失
  const ArrayEmpty = (value: any) => {
    if(Array.isArray(value) && value.length === 0) {
      return ""
    }else{
      return value
    }
  }
  // 所有筛选项的Key
  const allFilterKeys = Object.keys(FilterItemsKeyMap.value)
  // 此时选择的筛选项的key
  const showFilterItemsKeys = Object.keys(showFilterItemsMap.value)
  // 过滤出需要删除的key
  const clearKeys = allFilterKeys.filter((item: string) => !showFilterItemsKeys.includes(item))
  Object.keys(r).forEach((key: string) => {
    if(syncFilterRoute.value.includes(key)){
      query[key] = ArrayEmpty(r[key]);
    }
  })
  Object.keys(n).forEach((key: string) => {
    if(syncFilterRoute.value.includes(key)){
      query[key] = ArrayEmpty(n[key]);
    }
  })
  const tempClearQuery = {
    ...route.query,
    ...query
  }
  clearKeys.forEach((key: string) => delete tempClearQuery[key])
  const tempClearQueryKeys = Object.keys(tempClearQuery)
  // 将当前显示的选项中不存在查询参数的加入，表单数据不存在的也更新加入
  showFilterItemsKeys.forEach((key: string) => {
    if(!tempClearQueryKeys.includes(key)){
      if(syncFilterRoute.value.includes(key)){
        tempClearQuery[key] = FilterItemsKeyMap.value[key].default
      }
      if(FilterItemsKeyMap.value[key].disableFilter){
        nonRequestForms.value[key] = FilterItemsKeyMap.value[key].default
      }else{
        requestForms.value[key] = FilterItemsKeyMap.value[key].default
      }
    }
  })
  router.push({
    query: tempClearQuery
  })
}
const emitApply = (v: Record<string, FilterValue>, emitFuncName: any) => {
  const temp = {...v}
  Object.keys(temp).forEach((key: string) => {
    if(!showFilterItemsMap.value[key]?.isUsable){
      delete temp[key]
    }
  })
  emit(emitFuncName, temp)
}
const applyFilter = () => {
  emitChange(requestForms.value, nonRequestForms.value)
  emitApply(requestForms.value, 'applyFiltering')
  emitApply(nonRequestForms.value, 'applyNonFiltering')
}
if(props.onChangeQuery){
  // 所有筛选数据变化时触发change
  watch(() => [requestForms.value, nonRequestForms.value], ([r, n]) =>{
    emitChange(r, n)
  }, {immediate: true, deep: true})
  // 请求数据变化时触发applyFiltering
  watch(requestForms.value, v => {
    emitApply(v, 'applyFiltering')
  })
  // 非请求数据变化时触发applyNonFiltering
  watch(nonRequestForms.value, v => {
    emitApply(v, 'applyNonFiltering')
  })
  // 需要显示的数据改变时时触发applyNonFiltering
  watch(showFilterItems, () => {
    applyFilter()
  })
}
const clearFilter = () => {
  showFilterItems.value.forEach((item: showFilterItemType) => {
    const temp: FilterItemType = FilterItemsKeyMap.value[item.key]
    if(temp.disableFilter){
      nonRequestForms.value[item.key] = temp.default
    }else{
      requestForms.value[item.key] = temp.default
    }
  })
}
// 初始化时立即应用筛选
applyFilter()
/*--*/
/* 自定义选择筛选项区域功能 */
const customFilterItems = computed({
  get: () => {
    return showFilterItems.value.map((item: showFilterItemType) => item.key)
  },
  set: (value: string[]) => {
    // console.log('showFilterItems', showFilterItems.value)
    // console.log('value', value)
    // 先过滤掉删除的项
    const temp = showFilterItems.value.filter((item: showFilterItemType) => value.includes(item.key))
    // console.log('temp', temp)
    // 临时计算防止反复调用
    const showFilterItemKeys = temp.map((item: showFilterItemType) => item.key)
    // 反向过滤出需要添加的项
    const addTemp = value.filter((item: string) => !showFilterItemKeys.includes(item)).map((item: string) => {
      return {
        key: item,
        isUsable: true,
      }
    })
    // console.log('addTemp', addTemp)
    showFilterItems.value =  [
      ...temp,
      ...addTemp
    ]
  }
})
const searchFilterKeys = ref<string>('')
const searchFilterItems = computed(() => {
  return props.filterItems.filter((item: FilterItemType) => {
    const isMatchLabel = item.label.includes(searchFilterKeys.value)
    const isMatchKey = (item.key).toLowerCase().includes(searchFilterKeys.value.toLowerCase())
    const isMatchPinyin = pinyin(item.label, { toneType: 'none' }).replace(/\s+/g, '').includes(searchFilterKeys.value.toLowerCase())
    return isMatchLabel || isMatchKey || isMatchPinyin
  })
})
const groupFilterItems = computed(() => {
  return searchFilterItems.value.reduce((acc: Record<string, FilterItemType[]>, item: FilterItemType) => {
    const groupKey = item?.group || '默认'
    // 若当前分组不存在，则初始化空数组
    if (!acc[groupKey]) {
      acc[groupKey] = []
    }
    // 向分组数组中添加当前项
    acc[groupKey].push(item)
    return acc
  }, {})
});
/*--*/
defineExpose({
  setFilterShow, // 暴露控制筛选区域的显隐方法
  getForms, // 暴露获取所有的筛选数据方法
  setForms, // 暴露设置筛选数据的值
})
</script>
<template>
  <div class="dynamic-filtering">
    <div class="dynamic-filtering-header">
      <el-button type="" link @click="isFilterOpen = !isFilterOpen">
        <span :style="{transition: 'all 0.2s ease',fontSize: '0.5rem',transform: isFilterOpen ? 'rotate(90deg)' :'rotate(0deg)'}">▶</span>
        <span style="font-size: 0.875rem;margin-left: 0.3rem"><slot name="title">{{ props.title }}</slot></span>
      </el-button>
    </div>
    <div v-show="isFilterOpen">
      <div class="filter-items-container">
        <template v-for="item in sortedShowFilterItems">
          <el-checkbox v-model="item.isUsable" size="default"></el-checkbox>
          <span style="font-size: 0.875rem;color: var(--el-text-color-regular);text-align-last: justify;">{{ FilterItemsKeyMap[item.key].label }}</span>
          <template v-if="FilterItemsKeyMap[item.key]?.disableFilter">
            <PredefineFiltering v-model="nonRequestForms[item.key]" v-if="typeof FilterItemsKeyMap[item.key]?.component === 'string'" :type="FilterItemsKeyMap[item.key]?.component as any" :prop="FilterItemsKeyMap[item.key]?.props"></PredefineFiltering>
            <Component v-model="nonRequestForms[item.key]" v-else :is="FilterItemsKeyMap[item.key]?.component" v-bind="FilterItemsKeyMap[item.key]?.props"></Component>
          </template>
          <template v-else>
            <PredefineFiltering v-model="requestForms[item.key]" v-if="typeof FilterItemsKeyMap[item.key]?.component === 'string'" :type="FilterItemsKeyMap[item.key]?.component as any" :prop="FilterItemsKeyMap[item.key]?.props"></PredefineFiltering>
            <Component v-model="requestForms[item.key]" v-else :is="FilterItemsKeyMap[item.key]?.component" v-bind="FilterItemsKeyMap[item.key]?.props"></Component>
          </template>
        </template>
      </div>
      <div class="control-container">
        <!--    选择筛选项的弹出框    -->
        <el-popover placement="right-start" trigger="click" popper-style="min-width: 15rem;width: auto;">
          <template #reference>
            <el-button class="non-margin" circle type="primary" :icon="Filter"></el-button>
          </template>
          <template #default>
            <div class="filter-items-select-container">
              <el-input style="height: 1.75rem;" v-model="searchFilterKeys" placeholder="搜索筛选项" clearable>
                <template #prefix>
                  <el-icon class="el-input__icon"><search /></el-icon>
                </template>
              </el-input>
              <el-scrollbar max-height="20rem" style="margin-top: .5rem;">
                <el-checkbox-group v-model="customFilterItems" class="checkbox-group-container">
                  <template v-for="group in Object.keys(groupFilterItems).sort(item => item === '默认' ? -1 : 0)">
                    <div class="filter-item-group">
                      <el-tag effect="dark">{{ group }}</el-tag>
                      <el-checkbox
                        v-for="item in groupFilterItems[group]"
                        :key="item.key"
                        :value="item.key"
                        :label="item.label"
                        size="default"
                      ></el-checkbox>
                    </div>
                  </template>
                </el-checkbox-group>
              </el-scrollbar>
            </div>
          </template>
        </el-popover>
        <!-- -->
        <el-button class="non-margin" v-if="!onChangeQuery" type="primary" @click="applyFilter" @keydown.ctrl.enter.prevent="applyFilter" round>
          <span style="font-size: 0.75rem;">
            查询&ensp;Ctrl<svg viewBox="0 0 48 48" focusable="false" data-icon="roll-bottom-left" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M28.9999 8C36.7319 8 42.9999 14.268 42.9999 22C42.9999 29.732 36.7319 36 28.9999 36H11.8282L16.8282 41L13.9998 43.8284L4.17139 34L13.9998 24.1716L16.8282 27L11.8282 32H28.9999C34.5227 32 38.9999 27.5228 38.9999 22C38.9999 16.4772 34.5227 12 28.9999 12H15.7007V8H28.9999Z"></path></svg>
          </span>
        </el-button>
        <el-tooltip content="将所有筛选重置为默认值" effect="dark" placement="top" :show-after="700">
          <el-button type="default" round @click="clearFilter">
            重置筛选
          </el-button>
        </el-tooltip>
        <!--    control    -->
        <slot name="control"></slot>
      </div>
    </div>
    <div class="dynamic-filtering-footer">
      <slot name="footer"></slot>
      <el-tooltip content="刷新" placement="top" effect="light">
        <el-button style="width: 1.25rem" plain @click="applyFilter">
          <el-icon :size="'1rem'"><RefreshRight /></el-icon>
        </el-button>
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
.control-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: .5rem;
  margin-top: .5rem;

  button {
    margin: 0;
  }
}
.filter-items-container {
  display: grid;
  grid-template-columns: repeat(5, 1rem auto 1fr);
  grid-auto-rows: 1.75rem;
  align-items: center;
  gap: .5rem;
}
.filter-items-select-container {
  position: relative;
}
.checkbox-group-container {
  display: flex;
  flex-direction: row;

  .filter-item-group {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: start;
    gap: .5rem;
    width: 7rem;
  }
}
.dynamic-filtering-footer {
  height: 2rem;
  position: absolute;
  display: flex;
  flex-direction: row;
  align-items: end;
  justify-content: flex-end;
  gap: 0.5rem;
  bottom: 0;
  right: 0;
}
.dynamic-filtering {
  position: relative;
}
</style>
