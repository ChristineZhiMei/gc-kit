<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
const route = useRoute?.()
const router = useRouter?.()
console.log(route)
</script>

<template>
<TestButton :route="route" :router="router"></TestButton>
</template>

<style scoped>

</style>