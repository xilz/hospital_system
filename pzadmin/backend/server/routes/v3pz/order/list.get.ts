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
  const stateFilter = query.state ? parseInt(query.state as string) : null;
  const page = parseInt(query.page as string) || 1;
  const pageSize = parseInt(query.pageSize as string) || 10;

  // 暂时固定用户ID，实际应从token解析用户
  const userId = 106;

  // 过滤当前用户的订单
  let orders = state.orders.filter(order => order.user_id === userId);

  // 按状态筛选
  if (stateFilter && [1, 2, 3, 4].includes(stateFilter)) {
    orders = orders.filter(order => order.state === stateFilter);
  }

  // 按创建时间倒序排序（最新的在前）
  orders.sort((a, b) => b.create_time - a.create_time);

  // 分页
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedOrders = orders.slice(startIndex, endIndex);

  // 格式化订单数据，关联陪护师和医院信息
  const formattedOrders = paginatedOrders.map(order => {
    const companion = state.companions.find(c => c.id === order.companion_id);
    const hospital = state.hospitals.find(h => h.id === order.hospital_id);

    // 状态文本映射
    const stateMap: Record<number, string> = {
      1: '待支付',
      2: '待服务',
      3: '已完成',
      4: '已取消'
    };

    return {
      id: order.id,
      order_no: order.order_no,
      companion_name: companion?.name || '未知陪护师',
      companion_avatar: companion?.avatar || '',
      hospital_name: order.hospital_name,
      demand: order.demand,
      receiveAddress: order.receiveAddress,
      tel: order.tel,
      starttime: order.starttime,
      state: order.state,
      state_text: stateMap[order.state] || '未知状态',
      amount: order.amount,
      create_time: order.create_time,
      // 格式化时间
      starttime_formatted: new Date(order.starttime).toLocaleString('zh-CN'),
      create_time_formatted: new Date(order.create_time).toLocaleString('zh-CN')
    };
  });

  return {
    code: 10000,
    message: 'success',
    data: {
      list: formattedOrders,
      total: orders.length,
      page,
      pageSize,
      totalPages: Math.ceil(orders.length / pageSize),
      stats: {
        total: orders.length,
        pending_payment: orders.filter(o => o.state === 1).length,
        pending_service: orders.filter(o => o.state === 2).length,
        completed: orders.filter(o => o.state === 3).length,
        cancelled: orders.filter(o => o.state === 4).length
      }
    }
  };
});