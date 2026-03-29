import { defineEventHandler } from "h3";
import { requireValidToken } from "../_utils/token";
import { permissionTree } from "../_utils/mock-db";

export default defineEventHandler((event) => {
  const tokenCheck = requireValidToken(event);
  if (tokenCheck) return tokenCheck;

  return {
    code: 10000,
    message: "success",
    data: permissionTree,
  };
});

