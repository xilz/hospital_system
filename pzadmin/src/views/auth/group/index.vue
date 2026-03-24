<!-- 🌟 -->
<template>
    <PanelHead>
        <template #title>菜单管理</template>
        <template #description>菜单规则通常对应一个控制器的方法,同时菜单栏数据也从规则中获取</template>
    </PanelHead>
    <div class="btns">
        <el-button :icon="Plus" type="primary" @click="open(null)" size="small">新增</el-button>
    </div>
    <el-table :data="tableData.list" style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permissionName" label="菜单权限" />
        <el-table-column label="操作" >
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">编辑</el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination
        v-model:current-page="paginationData.pageNum"
        :page-size="paginationData.pageSize"
        :page-sizes="[10, 20, 50]"
        size="small"
        :disabled="disabled"
        layout="total, prev, pager, next"
        :total="tableData.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        />
    </div>
    <el-dialog
    v-model="dialogFormVisible"
    :before-close="beforeClose"
    title="添加权限"
    width="500"
    >
        <el-form
        ref="formRef"
        label-width="100px"
        label-position="left"
        :model="form"
        :rules="rules"
        >
            <el-form-item v-show="false" prop="id">
                <el-input v-model="form.id"/>
            </el-form-item>
            <el-form-item label="name" prop="name">
                <el-input v-model="form.name" placeholder="请填写权限名称" />
            </el-form-item>
            <el-form-item label="permission" prop="permission">
                <el-tree
                ref="treeRef"
                :data="permissionData"
                style="max-width: 600px"
                node-key="id"
                show-checkbox
                :default-checked-keys="defaultKeys"
                :default-expanded-keys="[1, 4]"
                :disabled="isNodeDisabled"
                ></el-tree>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)">确认</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { userGetMenu, userSetMenu, menuList } from '@/api';
import { ref, reactive, onMounted, nextTick } from 'vue';
import PanelHead from '@/components/panelHead.vue';
import { Plus } from '@element-plus/icons-vue';

onMounted(() => {
    userGetMenu().then(({ data }) => {
        console.log(data);  
        permissionData.value = data.data
    })
    getListData()
})

// 列表数据
const tableData = reactive({
    list: [],
    total: 0
})

const paginationData = reactive({
    pageNum: 1,
    pageSize: 10
})

const getListData = () => {
    menuList(paginationData).then(({ data }) => {
        if (data?.code === 10000 && data?.data) {
            const { list, total } = data.data
            tableData.list = list
            tableData.total = total
        } else {
            tableData.list = []
            tableData.total = 0
        }
    })
}

const disabled = false

const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()
}

const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}

const open = (rowData = {}) => {
    dialogFormVisible.value = true
    nextTick(() => {
        if (rowData) {
            Object.assign(form, { id: rowData.id, name: rowData.name })
            const permissions = rowData.permission || []
            const finalPermissions = [...new Set([...permissions, 1])]
            treeRef.value.setCheckedKeys(finalPermissions)
        }
    })
}
const formRef = ref()
const form = reactive ({
    name: '',
    permission: '',
    id: ''
})

const permissionData = ref([])
const dialogFormVisible = ref(false)
const beforeClose = () => {
    dialogFormVisible.value = false
    formRef.value.resetFields()
    treeRef.value.setCheckedKeys(defaultKeys)
}
const defaultKeys = [1]
const treeRef = ref()

const isNodeDisabled = (node) => {
    return node.id === 1
}

const rules = reactive ({
    name: [{ require: true, trigger: 'blur', message: '请输入权限名称' }]
})

const confirm = async (formEl) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            const permissions = JSON.stringify(treeRef.value.getCheckedKeys())
            userSetMenu({ name: form.name, permissions, id: form.id }).then(({ data }) => {
                console.log(data)
                beforeClose()
                getListData()
            })
        } else {
            console.log('error submit!', fields)
        }
    })
}
</script>

<style lang="less" scoped>
.btns {
    padding: 10px 0 10px 10px;
    background-color: #ffffff;
}
</style>