<template>
<div class="header-container">
    <div class="header-left flex-box">
        <el-icon class="icon" size="20" @click="collapse"><Fold /></el-icon>
        <ul class="flex-box">
            <li v-for="(item, index) in selectMenu"
            :key="item.path"
            :class="{selected: route.path === item.path}"
            class="tab flex-box">
            <el-icon class="icon1" size="12"><component :is="item.icon" /></el-icon>
            <RouterLink
            class="text flex-box"
            :to="{ path: item.path }"
            >
            {{ item.name }}
            </RouterLink>
            <el-icon class="icon1 close" size="12" @click="closeTab(item, index)"><Close/></el-icon>
            </li>
        </ul>
    </div>
    <div class="header-right">
        <el-dropdown @command="handleClick">
            <div class="el-dropdown-link flex-box">
                <el-avatar
                    src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                />
                <p class="user-name">{{ userInfo.name }}</p>
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
            </div>
            <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item command="cancel">退出</el-dropdown-item>
            </el-dropdown-menu>
            </template>
        </el-dropdown>
    </div>
</div>
</template>

<script setup>
import { computed } from 'vue';
import { useMenuStore } from '@/store/useMenuStore';
import { ArrowDown, Fold, Close } from '@element-plus/icons-vue';
import { useRoute, useRouter } from 'vue-router';

const menu = useMenuStore()
const collapse = () => {
    menu.collapseMenu()
}
const selectMenu = computed(() => menu.selectMenu)
const route = useRoute()
const router = useRouter()

const userInfo = JSON.parse(localStorage.getItem('pz_userInfo'))

function closeTab(item, index) {
    const isActive = route.path === item.path
    const tabs = selectMenu.value
    let nextTab = null
    if (isActive) {
    nextTab = tabs[index + 1] || tabs[index - 1]
    }
    menu.closeMenu(item)
    if (isActive) {
        if (nextTab) {
            router.replace(nextTab.path)
        } else {
            router.replace('/')
        }
    }
}
const handleClick = (command) => {
    if (command === 'cancel') {
        localStorage.removeItem('pz_token')
        localStorage.removeItem('pz_userInfo')
        window.location.href = window.location.origin
    }
}
</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}
.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    background-color: #fff;
    padding-right: 25px;
    .header-left {
        height: 100%;
        .icon {
            width: 45px;
            height: 100%;
        }
        .icon:hover {
            background-color: #f5f5f5;
            cursor: pointer;
        }
        .tab {
            padding: 0 10px;
            height: 100%;
            .text {
                margin: 0 5px;
            }
            .icon1 {
                height: 100%;
                margin: 2px;
            }
            .close {
                visibility: hidden;
            }
            &.selected {
                a {
                    color: #409eff;
                }
                i {
                    color: #409eff;
                }
                background-color: #f5f5f5;
            }
        }
        .tab:hover {
            background-color: #f5f5f5;
            .close {
                visibility: inherit;
                cursor: pointer;
                color: #000;
            }
        }
    }
}

a {
    color: #333;
    height: 100%;
    font-size: 15px;
}

.header-right {
    .user-name {
        margin-left: 10px;
    }
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>