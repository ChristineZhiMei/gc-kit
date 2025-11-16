<script setup lang="ts">
const props = defineProps({
  route: {
    type: Object,
    required: true,
    default: () => ({})
  },
  router: {
    type: Object,
    required: true,
    default: () => ({})
  }
})
const route = props?.route
const router = props?.router
if (route) {
  console.log('路由信息：', route)
}
defineOptions({
  name: 'TestButton'
})
const handleClick = () => {
  console.log('点击了测试按钮', route)
}
</script>

<template>
  <div class="gc-test-button">
    <el-button size="small" v-bind="$attrs" @click="handleClick"><span class="spans">测试按钮</span></el-button>
  </div>
</template>

<style lang="scss">
@import "../../styles/index.scss";
.gc-test-button {
  height: 100px;
  background-color: aqua;
  @include flex-xy-center;
  .spans {
    font-size: 20px;
  }
}
</style>