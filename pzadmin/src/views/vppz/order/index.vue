<template>
    <PanelHead>
    <template #title>订单管理</template>
    <template #description
        >C端下单后可以查看所有订单状态，已支付的订单可以完成陪护状态修改</template>
    </PanelHead>
    <div class="form">
        <el-form :inline="true" :model="searchForm">
            <el-form-item prop="out_trade_no">
                <el-input v-model="searchForm.out_trade_no" placeholder="订单号" />
            </el-form-item>
            <el-form-item prop="out_trade_no">
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-table :data="tableData.list">
        <el-table-column prop="order_no" label="订单号"></el-table-column>
        <el-table-column prop="hospital_name" label="就诊医院"></el-table-column>
        <el-table-column prop="demand" label="服务"></el-table-column>
        <el-table-column label="陪护师头像">
            <template #default="scope">
                <el-image style="width: 40px; height: 40px;" :src="scope.row.companion_avatar" />
            </template>
        </el-table-column>
        <el-table-column label="陪护师手机号">
            <template #default="scope">
                {{ scope.row.tel }}
            </template>
        </el-table-column>
        <el-table-column prop="amount" label="总价"></el-table-column>
        <el-table-column prop="create_time_formatted" label="下单时间"></el-table-column>
        <el-table-column label="订单状态">
            <template #default="scope">
                <el-tag :type="statusMap(scope.row.state_text)">{{ scope.row.state_text }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="user_mobile" label="联系人手机号"></el-table-column>
    </el-table>
    <div class="pagination-info">
    <el-pagination
      v-model:current-page="paginationData.pageNum"
      :page-size="paginationData.pageSize"
      :page-sizes="[10, 20, 50]"
      size="small"
      layout="total, prev, pager, next"
      :total="tableData.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import dayjs from 'dayjs';
import { adminOrder } from '../../../api'
import PanelHead from '@/components/panelHead.vue';

onMounted(() => {
    getListData()
})
const paginationData = reactive({
  pageNum: 1,
  pageSize: 10,
});

const tableData = reactive({
  list: [],
  total: 0,
});

const handleSizeChange = (val) => {
    paginationData.pageSize = val
    getListData()
}

const handleCurrentChange = (val) => {
    paginationData.pageNum = val
    getListData()
}

const searchForm = reactive({
    out_trade_no: ''
})

const onSubmit = () => {
    getListData(searchForm)
}

const getListData = (params = {}) => {
    adminOrder({...paginationData, ...params}).then(({ data }) => {
        console.log('订单列表响应:', data)
        const { list, total } = data.data
        console.log('list:', list)
        console.log('total:', total)
        list.forEach(item => {
            item.create_time = dayjs(item.create_time).format('YYYY-MM-DD')
        });
        tableData.list = list
        tableData.total = total
    }).catch(err => {
        console.error('获取订单列表失败:', err)
    })
}
const statusMap = (key) => {
    const obj = {
        '已取消': 'info',
        '待支付': 'warning',
        '已完成': 'success'
    }
    return obj[key]
}
</script>

<style lang="less" scoped>
.form {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
</style>