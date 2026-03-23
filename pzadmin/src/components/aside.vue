<template>
    <el-menu
        :style="{ width: !isCollapse ?'230px' : '64px'}"
        :collapse="isCollapse"
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="aside-container"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect"
    >
        <p class="logo-lg">{{ !isCollapse ? 'DIDI陪诊' : 'DIDI' }}</p>
        <treeMenu :index="1" :menuData="menuData"/>
    </el-menu>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import treeMenu from './treeMenu.vue'
import { reactive, computed } from 'vue'
import { useMenuStore } from '@/store/useMenuStore'

const router = useRouter()
const menuData = reactive(router.options.routes[0].children)
const handleOpen = (key: string, keyPath: (string | number)[]) => {
console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: (string | number)[]) => {
console.log(key, keyPath)
}
const handleSelect = (key: string, keyPath: (string | number)[]) => {
console.log('select', key, keyPath)
}
const menu = useMenuStore()
const isCollapse = computed(() => menu.isCollapse)
</script>
  

<style lang="less" scoped>
.aside-container {
    height: 100%;
    .logo-lg {
        font-size: 20px;
        text-align: center;
        height: 50px;
        line-height: 50px;
        color: #fff;
        font-family: Arial, Helvetica, sans-serif;
    }
}
</style>