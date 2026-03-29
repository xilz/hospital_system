import { getQuery, defineEventHandler } from "h3";
import { requireValidToken } from "../_utils/token";
import { state } from "../_utils/mock-db";

export default defineEventHandler((event) => {
  const tokenCheck = requireValidToken(event);
  if (tokenCheck) return tokenCheck;

  const query = getQuery(event);
  const pageNum = Number(query.pageNum ?? 1);
  const pageSize = Number(query.pageSize ?? 10);

  const total = state.users.length;
  const start = (pageNum - 1) * pageSize;
  const list = state.users.slice(start, start + pageSize).map((u) => ({
    id: u.id,
    name: u.name,
    permissions_id: u.permissions_id,
    mobile: u.mobile,
    active: u.active,
    create_time: u.create_time,
  }));

  return {
    code: 10000,
    message: "success",
    data: { list, total },
  };
});

