import { defineEventHandler, readBody } from "h3";
import { requireValidToken } from "../_utils/token";
import { state } from "../_utils/mock-db";

export default defineEventHandler(async (event) => {
  const tokenCheck = requireValidToken(event);
  if (tokenCheck) return tokenCheck;

  const body = await readBody(event);
  const { name, permissions_id, id } = body;

  // 如果有id，更新现有用户；否则创建新用户（暂时不支持）
  if (id) {
    const userIndex = state.users.findIndex(u => u.id === id);
    if (userIndex >= 0) {
      state.users[userIndex] = {
        ...state.users[userIndex],
        name: name || state.users[userIndex].name,
        permissions_id: permissions_id !== undefined ? permissions_id : state.users[userIndex].permissions_id,
      };
      return {
        code: 10000,
        message: "success",
        data: null,
      };
    } else {
      return {
        code: -1,
        message: "用户不存在",
        data: null,
      };
    }
  } else {
    // 创建新用户（暂时不实现）
    return {
      code: -1,
      message: "暂不支持创建新用户",
      data: null,
    };
  }
});