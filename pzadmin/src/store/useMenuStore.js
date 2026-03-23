import { defineStore } from "pinia";

export const useMenuStore = defineStore("menu", {
    state: () => ({
        isCollapse: false,
        selectMenu: []
    }),

    getters: {

    },

    actions: {
        collapseMenu() {
            this.isCollapse = !this.isCollapse
        },
        addMenu(payload) {
            if (!this.selectMenu.some(item => item.path === payload.path)) {
                this.selectMenu.push(payload)
            }
        },
        closeMenu(payload) {
            // 找到点击数据的索引
            const index = this.selectMenu.findIndex(val => val.name === payload.name)
            this.selectMenu.splice(index, 1)
        }
    }
})