import { defineEventHandler } from 'h3';
import { state } from './_utils/mock-db';
import { requireValidToken } from './_utils/token';

export default defineEventHandler(async (event) => {
  // 验证token
  const tokenError = requireValidToken(event);
  if (tokenError) {
    return tokenError;
  }

  // 订单统计
  const totalOrders = state.orders.length;
  const pendingPaymentOrders = state.orders.filter(o => o.state === 1).length;
  const pendingServiceOrders = state.orders.filter(o => o.state === 2).length;
  const completedOrders = state.orders.filter(o => o.state === 3).length;
  const cancelledOrders = state.orders.filter(o => o.state === 4).length;

  // 计算总收入（仅已完成订单）
  const totalRevenue = state.orders
    .filter(o => o.state === 3)
    .reduce((sum, order) => sum + order.amount, 0);

  // 用户统计
  const totalUsers = state.users.length;
  const activeUsers = state.users.filter(u => u.active === 1).length;
  const inactiveUsers = state.users.filter(u => u.active === 0).length;

  // 陪护师统计
  const totalCompanions = state.companions.length;
  const activeCompanions = state.companions.filter(c => c.active === 1).length;
  const inactiveCompanions = state.companions.filter(c => c.active === 0).length;

  // 医院统计
  const totalHospitals = state.hospitals.length;

  // 最近7天订单数（模拟数据，按创建时间判断）
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
  const recentOrders = state.orders.filter(o => o.create_time >= sevenDaysAgo).length;

  return {
    code: 10000,
    message: 'success',
    data: {
      // 订单统计
      order_stats: {
        total: totalOrders,
        pending_payment: pendingPaymentOrders,
        pending_service: pendingServiceOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
        total_revenue: totalRevenue,
        recent_7days: recentOrders
      },
      // 用户统计
      user_stats: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers
      },
      // 陪护师统计
      companion_stats: {
        total: totalCompanions,
        active: activeCompanions,
        inactive: inactiveCompanions
      },
      // 医院统计
      hospital_stats: {
        total: totalHospitals
      },
      // 汇总数据
      summary: {
        total_orders: totalOrders,
        total_users: totalUsers,
        total_companions: totalCompanions,
        total_hospitals: totalHospitals,
        total_revenue: totalRevenue
      }
    }
  };
});