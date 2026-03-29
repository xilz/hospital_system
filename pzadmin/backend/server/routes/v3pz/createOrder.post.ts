import { defineEventHandler, readBody } from 'h3';
import { state } from './_utils/mock-db';
import { requireValidToken } from './_utils/token';

export default defineEventHandler(async (event) => {
  // 验证token
  const tokenError = requireValidToken(event);
  if (tokenError) {
    return tokenError;
  }

  try {
    const body = await readBody(event);

    // 验证必填字段
    const requiredFields = [
      'companion_id',
      'demand',
      'hospital_id',
      'hospital_name',
      'receiveAddress',
      'starttime',
      'tel'
    ];

    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return {
          code: -1,
          message: `缺少必填字段: ${field}`,
          data: null
        };
      }
    }

    // 验证陪护师是否存在且活跃
    const companion = state.companions.find(
      c => c.id === body.companion_id && c.active === 1
    );
    if (!companion) {
      return {
        code: -1,
        message: '陪护师不存在或不可用',
        data: null
      };
    }

    // 验证医院是否存在（可选）
    const hospital = state.hospitals.find(h => h.id === body.hospital_id);
    if (!hospital) {
      // 如果医院不存在，可以创建或只是警告，这里我们只记录
      console.log(`医院ID ${body.hospital_id} 不在预定义列表中`);
    }

    // 生成订单ID和订单号
    const nextId = state.orders.length > 0
      ? Math.max(...state.orders.map(o => o.id)) + 1
      : 1;

    const now = Date.now();
    const orderNo = `DD${new Date(now).getFullYear()}${(new Date(now).getMonth() + 1).toString().padStart(2, '0')}${new Date(now).getDate().toString().padStart(2, '0')}${nextId.toString().padStart(4, '0')}`;

    // 创建新订单
    const newOrder = {
      id: nextId,
      order_no: orderNo,
      user_id: 106, // 暂时固定用户ID，实际应从token解析用户
      companion_id: body.companion_id,
      hospital_id: body.hospital_id,
      hospital_name: body.hospital_name,
      demand: body.demand,
      receiveAddress: body.receiveAddress,
      tel: body.tel,
      starttime: body.starttime,
      state: 1, // 默认待支付
      amount: 299.00, // 默认金额，实际应根据业务计算
      create_time: now
    };

    // 保存到mock数据库
    state.orders.push(newOrder);

    // 返回成功响应
    return {
      code: 10000,
      message: '订单创建成功',
      data: {
        order_id: newOrder.id,
        order_no: newOrder.order_no,
        create_time: newOrder.create_time,
        state: newOrder.state,
        amount: newOrder.amount
      }
    };
  } catch (error) {
    console.error('创建订单失败:', error);
    return {
      code: -1,
      message: '创建订单失败，请稍后重试',
      data: null
    };
  }
});