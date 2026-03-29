import { defineEventHandler } from "h3";
import { requireValidToken } from "../_utils/token";
import { state } from "../_utils/mock-db";

export default defineEventHandler((event) => {
  const tokenCheck = requireValidToken(event);
  if (tokenCheck) return tokenCheck;

  // 返回角色列表，加上超级管理员和控制台选项
  const roleOptions = [
    { id: 0, name: "超级管理员" },
    ...state.roles.map(r => ({ id: r.id, name: r.name })),
    { id: 16, name: "控制台" }
  ];

  return {
    code: 10000,
    message: "success",
    data: roleOptions,
  };
});

