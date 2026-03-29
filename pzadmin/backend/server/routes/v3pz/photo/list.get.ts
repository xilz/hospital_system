import { defineEventHandler } from "h3";
import { requireValidToken } from "../_utils/token";
import { state } from "../_utils/mock-db";

export default defineEventHandler((event) => {
  const tokenCheck = requireValidToken(event);
  if (tokenCheck) return tokenCheck;

  // 返回所有陪护师的头像信息
  const avatarList = state.companions.map(companion => ({
    id: companion.id,
    mobile: companion.mobile,
    active: companion.active,
    age: companion.age,
    avatar: companion.avatar,
    name: companion.name,
    sex: companion.sex,
    create_time: companion.create_time,
  }));

  return {
    code: 10000,
    message: "success",
    data: avatarList,
  };
});