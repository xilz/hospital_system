import { defineEventHandler, readBody } from "h3";
import { requireValidToken } from "./_utils/token";
import { state, type Companion } from "./_utils/mock-db";

export default defineEventHandler(async (event) => {
  const tokenCheck = requireValidToken(event);
  if (tokenCheck) return tokenCheck;

  const body = await readBody(event);
  const { id, mobile, active, age, avatar, name, sex } = body;

  // 验证必需字段（id在更新时为必需，在创建时可选）
  if (!mobile || active === undefined || !age || !avatar || !name || !sex) {
    return {
      code: -1,
      message: "参数缺失",
      data: null,
    };
  }

  // 处理ID：如果id不存在或为假值，则生成新ID；否则转换为数字
  let finalId: number;

  if (id !== undefined && id !== null && id !== '') {
    const numericId = Number(id);
    // 查找是否已存在相同ID的陪护师
    const existingIndex = state.companions.findIndex(c => c.id === numericId);

    if (existingIndex >= 0) {
      // 更新现有陪护师
      const existing = state.companions[existingIndex]!;
      // 更新字段
      existing.mobile = mobile;
      existing.active = active;
      existing.age = age;
      existing.avatar = avatar;
      existing.name = name;
      existing.sex = sex;

      return {
        code: 10000,
        message: "success",
        data: existing,
      };
    } else {
      // id存在但未找到对应记录，视为创建新记录但使用提供的id
      finalId = numericId;
    }
  } else {
    // 生成新ID：当前最大ID加1
    const maxId = state.companions.length > 0
      ? Math.max(...state.companions.map(c => c.id))
      : 0;
    finalId = maxId + 1;
  }

  // 创建新陪护师
  const newCompanion: Companion = {
    id: finalId,
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
});