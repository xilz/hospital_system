import { getQuery, defineEventHandler } from "h3";
import { requireValidToken } from "../_utils/token";
import { state } from "../_utils/mock-db";

export default defineEventHandler((event) => {
  const tokenCheck = requireValidToken(event);
  if (tokenCheck) return tokenCheck;

  const query = getQuery(event);
  const pageNum = Number(query.pageNum ?? 1);
  const pageSize = Number(query.pageSize ?? 10);

  const total = state.companions.length;
  const start = (pageNum - 1) * pageSize;
  const list = state.companions.slice(start, start + pageSize);

  return {
    code: 10000,
    message: "success",
    data: {
      list: list.map((companion) => ({
        create_time: companion.create_time,
        id: companion.id,
        name: companion.name,
        mobile: companion.mobile,
        avatar: companion.avatar,
        sex: companion.sex,
        age: companion.age,
        active: companion.active,
      })),
      total,
    },
  };
});