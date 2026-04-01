import { defineEventHandler, getQuery } from 'h3';
import { state } from '../_utils/mock-db';

export default defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const page = parseInt(query.page as string) || 1;
  const pageSize = parseInt(query.pageSize as string) || 10;
  const keyword = query.keyword as string;

  // 过滤活跃的陪护师
  let companions = state.companions.filter(c => c.active === 1);

  // 关键词搜索（按姓名或手机号）
  if (keyword) {
    companions = companions.filter(c =>
      c.name.includes(keyword) || c.mobile.includes(keyword)
    );
  }

  // 分页
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCompanions = companions.slice(startIndex, endIndex);

  // 格式化返回数据
  const formattedCompanions = paginatedCompanions.map(c => ({
    id: c.id,
    name: c.name,
    avatar: c.avatar,
    age: c.age,
    sex: c.sex === '1' ? '男' : '女',
    mobile: c.mobile,
    active: c.active,
    create_time: c.create_time
  }));

  return {
    code: 10000,
    message: 'success',
    data: {
      list: formattedCompanions,
      total: companions.length,
      page,
      pageSize,
      totalPages: Math.ceil(companions.length / pageSize),
      hospitals: state.hospitals.map(h => ({ id: h.id, name: h.name }))
    }
  };
});