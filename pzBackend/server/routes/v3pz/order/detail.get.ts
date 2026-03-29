import { defineEventHandler, getQuery } from 'h3';
import { state } from '../_utils/mock-db';
import { requireValidToken } from '../_utils/token';

export default defineEventHandler(async (event) => {
  // 验证token
  const tokenError = requireValidToken(event);
  if (tokenError) {
    return tokenError;
  }

  const query = await getQuery(event);
  const oid = query.oid as string;

  if (!oid) {
    return {
      code: -1,
      message: '缺少订单ID参数',
      data: null
    };
  }

  const orderId = parseInt(oid);
  if (isNaN(orderId)) {
    return {
      code: -1,
      message: '订单ID格式错误',
      data: null
    };
  }

  // 暂时固定用户ID，实际应从token解析用户
  const userId = 106;

  // 查找订单
  const order = state.orders.find(o => o.id === orderId && o.user_id === userId);
  if (!order) {
    return {
      code: -1,
      message: '订单不存在或无权访问',
      data: null
    };
  }

  // 获取关联信息
  const companion = state.companions.find(c => c.id === order.companion_id);
  const hospital = state.hospitals.find(h => h.id === order.hospital_id);

  // 状态文本映射
  const stateMap: Record<number, string> = {
    1: '待支付',
    2: '待服务',
    3: '已完成',
    4: '已取消'
  };

  // 状态流程
  const stateFlow = [
    { state: 1, text: '待支付', description: '等待用户支付' },
    { state: 2, text: '待服务', description: '支付完成，等待服务开始' },
    { state: 3, text: '已完成', description: '服务已完成' },
    { state: 4, text: '已取消', description: '订单已取消' }
  ];

  // 当前状态在流程中的位置
  const currentStateIndex = stateFlow.findIndex(s => s.state === order.state);
  const stateProgress = stateFlow.map((s, index) => ({
    ...s,
    completed: index < currentStateIndex,
    current: index === currentStateIndex
  }));

  // 格式化订单详情
  const orderDetail = {
    id: order.id,
    order_no: order.order_no,
    user_id: order.user_id,

    // 陪护师信息
    companion: companion ? {
      id: companion.id,
      name: companion.name,
      avatar: companion.avatar,
      age: companion.age,
      sex: companion.sex === '1' ? '男' : '女',
      mobile: companion.mobile
    } : null,

    // 医院信息
    hospital: hospital ? {
      id: hospital.id,
      name: hospital.name,
      address: hospital.address
    } : {
      id: order.hospital_id,
      name: order.hospital_name,
      address: ''
    },

    // 订单详情
    demand: order.demand,
    receiveAddress: order.receiveAddress,
    tel: order.tel,
    starttime: order.starttime,
    starttime_formatted: new Date(order.starttime).toLocaleString('zh-CN'),

    // 状态信息
    state: order.state,
    state_text: stateMap[order.state] || '未知状态',
    state_progress: stateProgress,

    // 金额信息
    amount: order.amount,
    amount_formatted: `¥${order.amount.toFixed(2)}`,

    // 时间信息
    create_time: order.create_time,
    create_time_formatted: new Date(order.create_time).toLocaleString('zh-CN'),

    // 支付信息（模拟）
    payment: {
      method: '在线支付',
      status: order.state === 1 ? '待支付' : '已支付',
      pay_time: order.state === 1 ? null : order.create_time + 3600000,
      transaction_no: `TX${order.order_no}`
    },

    // 服务评价（模拟，仅已完成订单有）
    rating: order.state === 3 ? {
      score: 5,
      comment: '服务很好，非常专业',
      time: order.starttime + 86400000
    } : null
  };

  return {
    code: 10000,
    message: 'success',
    data: orderDetail
  };
});