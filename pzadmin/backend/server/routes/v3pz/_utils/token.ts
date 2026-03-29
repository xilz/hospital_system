import type { H3Event } from "h3";

const DEFAULT_TOKENS = [
  // 你给的 OpenAPI 示例 token（用于开发联调）
  "796be13b4e4f8c7d0383aafc7beed1c0",
  // 允许通过环境变量覆盖
  process.env.V3PZ_TOKEN,
].filter(Boolean) as string[];

const TOKEN_SET = new Set(DEFAULT_TOKENS);

export function readXToken(event: H3Event): string | undefined {
  // 优先读取 h-token（H5前端使用），如果没有则读取 x-token
  let headerVal = event.node?.req?.headers?.["h-token"];
  if (!headerVal) {
    headerVal = event.node?.req?.headers?.["x-token"];
  }
  if (!headerVal) return undefined;
  if (Array.isArray(headerVal)) return headerVal[0];
  return headerVal;
}

export function requireValidToken(event: H3Event) {
  const xToken = readXToken(event);
  if (!xToken || !TOKEN_SET.has(xToken)) {
    return { code: -1, message: "token无效", data: null as null };
  }
  return null;
}

