<template>
    <PanelHead>
        <template #title>管理员管理</template>
        <template #description>管理后台用户账号和权限分配</template>
    </PanelHead>

    <el-table :data="tableData.list" style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column prop="permission_id" label="所属组别">
            <template #default="scope">
            {{ permissionName(scope.row.permissions_id) }}
            </template>
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" />
        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">{{ scope.row.active ? '正常' : '失效' }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column  label="创建时间">
            <template #default="scope">
            <div class="flex-box">
                <el-icon><Clock /></el-icon>
                <span style="margin-left: 5px;">{{ scope.row.create_time }}</span>
            </div>
            </template>
        </el-table-column>
        <el-table-column label="操作">
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
            <el-form-item label="手机号" prop="mobile">
                <el-input v-model="form.mobile" disabled />
            </el-form-item>
            <el-form-item label="昵称" prop="name">
                <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions_id">
                <el-select 
                v-model="form.permissions_id"
                placeholder="请选择菜单权限" 
                style="width: 240px">
                    <el-option
                    v-for="item in options"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    />
                </el-select>
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
import { authAdmin, menuSelectList, updateUser } from "@/api";
import { reactive, onMounted, ref } from "vue";
import dayjs from "dayjs";
import { Clock } from "@element-plus/icons-vue";
import PanelHead from "@/components/panelHead.vue";

const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

const tableData = reactive({
  list: [],
  total: 0,
});

const disabled = false;
onMounted(() => {
    getListData()
    menuSelectList().then(({ data }) => {
        options.value = data.data;
    })
});

const getListData = () => {
    authAdmin(paginationData).then(({ data }) => {
        const { list, total } = data.data;
        list.forEach(item => {
            item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
        });
        tableData.list = list;
        tableData.total = total;
    })
}

const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()
}

const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}

const dialogFormVisible = ref(false)
const beforeClose = (done) => {
    form.id = ''
    form.mobile = ''
    form.name = ''
    form.permissions_id = ''
    dialogFormVisible.value = false
    if (done && typeof done === 'function') {
        done()
    }
}

const rules = reactive({
    name: [{ required: true, trigger: 'blur', message: '请填写昵称' }],
    permissions_id: [{ required: true, trigger: 'blur', message: '请选择菜单权限' }]
})

const formRef = ref()
const form = reactive({
    id: '',
    mobile: '',
    name: '',
    permissions_id: ''
})

const confirm = async (formEl) => {
    if (!formEl) return
    const isValid = await new Promise((resolve) => {
        formEl.validate((valid) => {
            resolve(valid)
        })
    })
    
    if (!isValid) return
    const { id, name, permissions_id } = form
    try {
        const { data } = await updateUser({ id, name, permissions_id })
        if (data.code === 10000) {
            beforeClose()
            await getListData()
        } else {
            console.log('更新失败', data.message)
        }
    } catch (error) {
        console.error('请求失败', error)
    }
}
const options = ref([]);

const permissionName = (permissionId) => {
  const data = options.value.find((el) => el.id === permissionId);
  return data ? data.name : "超级管理员";
};

const open = (rowData) => {
    dialogFormVisible.value = true
    Object.assign(form, {
        id: rowData.id,
        mobile: rowData.mobile,
        name: rowData.name,
        permissions_id: rowData.permissions_id
    })
}
</script>

<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
    height: 100%;
}
</style>
