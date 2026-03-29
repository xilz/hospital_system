import { defineEventHandler, getMethod, sendNoContent } from "h3";

// 简单放行跨域，便于你本地前端（不同端口）联调后端接口
export default defineEventHandler((event) => {
  event.node.res.setHeader("Access-Control-Allow-Origin", "*");
  event.node.res.setHeader("Access-Control-Allow-Headers", "x-token, content-type");
  event.node.res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (getMethod(event) === "OPTIONS") {
    return sendNoContent(event);
  }
});

