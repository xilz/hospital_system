import { readBody, defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Record<string, unknown> | null;
  const userName = body?.userName;
  const passWord = body?.passWord;

  if (!userName || !passWord) {
    return { code: -1, message: "参数缺失", data: null };
  }

  // 这里给一个固定 token，确保严格校验能通过
  const token = "796be13b4e4f8c7d0383aafc7beed1c0";

  return {
    code: 10000,
    msg: "success",
    message: "success",
    data: {
      token,
      userInfo: {
        id: 1,
        name: "DIDI",
        userName,
      },
    },
  };
});

