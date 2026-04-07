<template>
    <div class="container">
        <div class="header">
        <van-icon
            name="arrow-left"
            @click="goBack"
            class="header-left"
            size="25"
        />订单详情</div>
        <StatusBar :item="stateMap[detailData.state_text] || 0" />
        <div class="tips">
            <div class="dzf" v-if="detailData.state === 1">
                <div class="text1">订单待支付</div>
                <div class="text2">请在 <Counter :second="second" /> 内完成支付，超时订单自动取消</div>
                <div class="text3">
                <van-button @click="showCode=true" type="success">立即支付0.5元</van-button>
                </div>
            </div>
            <div class="dzf" v-if="detailData.state === 2">
                <div class="text1">正在为您安排服务专员...</div>
                <div>请保持手机畅通，稍后将有服务专员与您联系</div>
            </div>
            <div class="dzf" v-if="detailData.state === 3">
                <div class="text1">服务已完成</div>
                <div>感谢您的使用，如有售后问题请联系客服</div>
            </div>
            <div class="dzf" v-if="detailData.state === 4">
                <div class="text1">订单已取消</div>
                <div>期待下次为您服务，如需帮助可咨询客服</div>
            </div>
        </div>
        
        <van-cell-group class="card">
            <div class="header-left">预约信息</div>
            <van-cell v-for="(item, key) in makeInfo"
            :key="key"
            :title="item"
            :value="formatData(key)"
            />
        </van-cell-group>
        <van-cell-group class="card">
            <div class="header-left">订单信息</div>
            <van-cell v-for="(item, key) in orderInfo"
            :key="key"
            :title="item"
            :value="formatData(key)"
            />
        </van-cell-group>



        <van-dialog :show-cofirm-button="false" v-model:show="showCode">
            <van-icon name="cross" class="close" @click="closeCode" />
            <div>微信支付</div>
            <van-image width="150" height="150" :src="codeImg" />
            <div>请使用微信扫描二维码</div>
        </van-dialog>
    </div>

</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { computed, getCurrentInstance, onMounted, ref, reactive } from 'vue';
import StatusBar from '../../components/statusBar.vue';
import Counter from '../../components/counter.vue';
import Qrcode from 'qrcode'

const { proxy } = getCurrentInstance()
const detailData = reactive({})

const stateMap = {
    '待支付': 10,
    '待服务': 20,
    '已完成': 30,
    '已取消': 40
}

//订单详情
const makeInfo = {
    demand: '预约服务',
    'hospital.name': '就诊医院',
    starttime_formatted: '期望的就诊时间',
    'companion.name': '陪护人',
    'companion.mobile': '陪护人电话',
    receiveAddress: '接送地址'
}

const orderInfo = {
    tel: '联系电话',
    create_time_formatted: '下单时间',
    amount_formatted: '应付金额',
    order_no: '订单编号'
}

const formatData = (key) => {
  if (key.indexOf(".") === -1) {
    if (key === "starttime_formatted") {
      return formatTimestamp(detailData[key]);
    }
    return detailData[key];
  }
  let arr = key.split(".").reduce((o, p) => {
    return (o || {})[p];
  }, detailData);
  return arr;
}
function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 月份是从0开始的，所以需要+1
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

onMounted( async () => {
    const { data } = await proxy.$api.getOrderDetail({ oid: route.query.oid })
    Object.assign(detailData, data.data)
    Qrcode.toDataURL(data.data.wx_code).then((url) => {
      showCode.value = true
      codeImg.value = url
    })
    console.log(detailData);
})
const route = useRoute()
const router = useRouter()
const goBack = () => {
    router.go(-1)
}
// 计算倒计时（使用create_time时间戳）
const second = computed(() =>{
    if (!detailData.create_time) return 0;
    const remaining = detailData.create_time + 7200000 - Date.now();
    return remaining > 0 ? remaining : 0;
})

// 支付弹窗
const showCode = ref(false)
const codeImg = ref('')
const closeCode = () => {
  showCode.value = false
  router.push('/order')
}
</script>

<style lang="less" scoped>
.container {
    background-color: #f0f0f0;
    height: 100vh;
  }
.header {
  padding: 10px 0;
  text-align: center;
  line-height: 30px;
  font-size: 15px;
  .header-left {
    float: left;
  }
}
.card {
    margin: 15px 0;
    padding: 10px;
    .header-text {
        padding-left: 5px;
        line-height: 30px;
        font-size: 16px;
        font-weight: bold;
        border-left: 4px solid red;
    }
}
  .dzf {
    padding: 20px;
    .text1 {
      font-size: 20px;
      font-weight: bold;
      line-height: 30px;
      color: #666;
    }
    .text2 {
      font-size: 14px;
      color: #666;
    }
    .text3 {
      text-align: center;
      .van-button {
        margin-top: 10px;
        margin-left: 10px;
        width: 80%;
        font-weight: bold;
      }
    }
  }
  ::v-deep(.van-dialog__content) {
    text-align: center;
    padding: 20px;
    .close {
      position: absolute;
      left: 20px;
    }
  }
</style>