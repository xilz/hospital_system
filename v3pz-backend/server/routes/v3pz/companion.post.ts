import { defineEventHandler, readBody } from "h3";
import { requireValidToken } from "./_utils/token";
import { state, type Companion } from "./_utils/mock-db";

export default defineEventHandler(async (event) => {
  const tokenCheck = requireValidToken(event);
  if (tokenCheck) return tokenCheck;

  const body = await readBody(event);
  const { id, mobile, active, age, avatar, name, sex } = body;

  // 验证必需字段
  if (!mobile || active === undefined || !age || !avatar || !name || !sex || !id) {
    return {
      code: -1,
      message: "参数缺失",
      data: null,
    };
  }

  // 查找是否已存在相同ID的陪护师
  const existingIndex = state.companions.findIndex(c => c.id === id);

  if (existingIndex >= 0) {
    // 更新现有陪护师
    state.companions[existingIndex] = {
      ...state.companions[existingIndex],
      mobile,
      active,
      age,
      avatar,
      name,
      sex,
    };

    return {
      code: 10000,
      message: "success",
      data: state.companions[existingIndex],
    };
  } else {
    // 创建新陪护师
    const newCompanion: Companion = {
      id,
      mobile,
      active,
      age,
      avatar,
      name,
      sex,
      create_time: Date.now(),
    };

    state.companions.push(newCompanion);

    return {
      code: 10000,
      message: "success",
      data: newCompanion,
    };
  }
});