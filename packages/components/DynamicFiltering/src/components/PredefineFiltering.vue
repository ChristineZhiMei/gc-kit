<script setup lang="ts">
import type {PredefineComponentType} from "../types/DynamicFiltering";
import { computed } from "vue";
const emit = defineEmits(["update:modelValue"]);
const props = withDefaults(defineProps<{
  type?: PredefineComponentType
  prop?: Record<string, any>
  modelValue?: any
}>(), {
  type: 'dyf-input',
  prop: () => ({}),
  modelValue: undefined
})
const value = computed({
  get: () => props.modelValue,
  set: (val: any) => {
    emit("update:modelValue", val)
  }
})
</script>

<template>
<div class="predefine-filtering">
  <el-input v-if="props.type === 'dyf-input'" style="width: 15rem" v-bind="props.prop" v-model="value" />
  <el-select v-else-if="props.type === 'dyf-select'" style="width: 15rem" v-bind="props.prop" v-model="value" />
  <el-select v-else-if="props.type === 'dyf-select-multiple'"  style="width: 15rem" multiple collapse-tags collapse-tags-tooltip :max-collapse-tags="2" filterable v-bind="props.prop" v-model="value"/>
  <el-cascader v-else-if="props.type === 'dyf-cascader'" style="width: 15rem" filterable v-bind="props.prop" v-model="value"></el-cascader>
</div>
</template>

<style scoped lang="scss">
.predefine-filtering {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: .5rem;
}
</style>
