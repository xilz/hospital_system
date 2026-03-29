import { readBody, defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Record<string, unknown> | null;
  const userName = body?.userName;
  const passWord = body?.passWord;
  const validCode = body?.validCode;

  if (!userName || !passWord || !validCode) {
    return { code: -1, msg: "参数缺失", message: "参数缺失", data: null };
  }

  const { state } = await import("../_utils/mock-db");
  const expected = state.smsCodes[String(userName)] ?? "1234";

  if (String(validCode) !== expected) {
    return { code: -1, msg: "验证码错误", message: "验证码错误", data: null };
  }

  return {
    code: 10000,
    msg: "success",
    message: "success",
    data: null,
  };
});

