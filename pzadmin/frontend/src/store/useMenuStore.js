import { defineStore } from "pinia";

export const useMenuStore = defineStore("menu", {
    state: () => ({
        isCollapse: false,
        selectMenu: [],
        menuActive: '1-1'
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
            const index = this.selectMenu.findIndex(val => val.path === payload.path)
            if (index !== -1) {
                this.selectMenu.splice(index, 1)
            }
        },
        cleanupInvalidTabs(validRoutes) {
            this.selectMenu = this.selectMenu.filter(tab => {
                const validRoute = validRoutes.find(route => route.path === tab.path)
                if (validRoute) {
                    Object.assign(tab, validRoute)
                    return true
                }
                return false
            })
        },
        clearAllTabs() {
            this.selectMenu = []
        },
        updateMenuActive(payload) {
            this.menuActive = payload
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {
                key: 'menu-store',
                storage: sessionStorage,
                paths: ['selectMenu', 'isCollapse']
            }
        ]
    }
})