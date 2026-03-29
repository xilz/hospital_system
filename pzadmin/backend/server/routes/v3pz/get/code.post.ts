import { readBody, defineEventHandler } from "h3";

export default defineEventHandler(async (event) => {
  // 这里保持“mock”：只要传了 tel，就返回成功
  const body = (await readBody(event)) as Record<string, unknown> | null;
  const tel = body?.tel;
  if (!tel) {
    return { code: -1, msg: "tel缺失", message: "tel缺失", data: null };
  }

  // 这里模拟短信验证码：固定返回 1234
  const validCode = "1234";

  // 延迟导入避免循环引用（只是简单写法，保持可读）
  const { state } = await import("../_utils/mock-db");
  state.smsCodes[String(tel)] = validCode;

  return {
    code: 10000,
    // 兼容你 OpenAPI 里的字段名：`msg`
    msg: "发送成功",
    // 兼容你前端 axios 拦截器/其它页面：`message`
    message: "success",
    // 有些页面不会用到 data，这里仍给出便于调试
    data: { tel, validCode },
  };
});

