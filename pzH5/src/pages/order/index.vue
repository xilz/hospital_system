<template>
    <div class="container">
        <div class="header">我的订单</div>
        <van-tabs v-model:active="active" @click-tab="onClickTab">
            <van-tab title="全部" name="" />
            <van-tab
            v-for="(text, key) in stateMap"
            :title="text"
            :name="Number(key)"
            >
            </van-tab>
        </van-tabs>
        <van-row @click="goDetail(item)" v-for="item in order" :key="item.id">
            <van-col span="5">
                <van-image width="50" height="50" radius="5" :src="item.companion_avatar" />
            </van-col>
            <van-col span="14">
                <div class="text1">
                    {{ item.hospital_name }}
                </div>
                <div class="text2">
                    <div>{{ item.demand }}</div>
                    <div>{{ formatDate(item.create_time_formatted) }}</div>
                </div>
            </van-col>
            <van-col class="text2" :style="{ color: colorMap[item.state_text] }" span="5">
                {{ item.state_text }}
                <Counter :second="item.timer" v-if="item.state_text === '待支付'" />
            </van-col>
        </van-row>
        <div class="bottom-text">没有更多了</div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Counter from '../../components/counter.vue';
import { ref, onMounted, getCurrentInstance } from 'vue';

const colorMap = {
    '待支付': '#ffa200',
    '待服务': '#1da6fd',
    '已完成': '21c521'
}

// 日期格式化函数
const formatDate = (dateString) => {
    try {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (error) {
        console.error('日期格式化错误:', error);
        return dateString; // 返回原始字符串作为降级方案
    }
}

const order = ref([])

onMounted(() => {
    getOrderList('')
})
// 请求当前vue实例
const { proxy } = getCurrentInstance()

// 获取订单列表
const getOrderList = async (state) => {
    const { data } = await proxy.$api.getOrderList({ state })
    console.log(data);
    data.data.list.forEach(element => {
        element.timer = element.starttime + 7200000 - Date.now();
        if (element.timer < 0) element.timer = 0;
    });
    order.value = data.data.list
}

const onClickTab = (item) => {
    getOrderList(item.name)
}
const active = ref("")
const stateMap = {
  1: '待支付',
  2: '待服务',
  3: '已完成',
  4: '已取消'
};

const router = useRouter()
// 跳转详情
const goDetail = (item) => {
    router.push(`/detail?oid=${item.id}`)

}
</script>

<style lang="less" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
}
.header {
background-color: #fff;
line-height: 40px;
text-align: center;
}
.van-row {
    background-color: #fff;
    padding: 10px;
    margin: 5px;
    border-radius: 5px;
    .text1 {
      font-size: 16px;
      line-height: 25px;
      font-weight: bold;
    }
    .text2 {
      font-size: 14px;
      line-height: 20px;
      color: #999999;
    }
}
.bottom-text {
    line-height: 50px;
    text-align: center;
    color: #999999;
}
</style>