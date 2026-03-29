import { defineEventHandler, readBody } from "h3";
import { requireValidToken } from "../_utils/token";
import { state } from "../_utils/mock-db";

export default defineEventHandler(async (event) => {
  const tokenCheck = requireValidToken(event);
  if (tokenCheck) return tokenCheck;

  const body = await readBody(event);
  const { id } = body;

  // 验证必需字段
  if (!id || !Array.isArray(id)) {
    return {
      code: -1,
      message: "参数缺失或格式错误",
      data: null,
    };
  }

  // 将字符串ID转换为数字
  const idsToDelete = id.map(item => parseInt(item, 10)).filter(item => !isNaN(item));

  if (idsToDelete.length === 0) {
    return {
      code: -1,
      message: "没有有效的ID",
      data: null,
    };
  }

  // 过滤掉要删除的陪护师
  const beforeLength = state.companions.length;
  state.companions = state.companions.filter(companion => !idsToDelete.includes(companion.id));
  const deletedCount = beforeLength - state.companions.length;

  return {
    code: 10000,
    message: "success",
    data: {
      deletedCount,
    },
  };
});