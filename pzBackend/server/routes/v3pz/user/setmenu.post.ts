import { defineEventHandler, readBody } from "h3";
import { requireValidToken } from "../_utils/token";
import { buildPermissionName, state } from "../_utils/mock-db";

export default defineEventHandler(async (event) => {
  const tokenCheck = requireValidToken(event);
  if (tokenCheck) return tokenCheck;

  const body = (await readBody(event)) as Record<string, unknown> | null;
  const name = typeof body?.name === "string" ? body?.name : "";
  const idNum = Number(body?.id);
  const permissionsRaw = body?.permissions;

  if (!name) {
    return { code: -1, msg: "name缺失", message: "name缺失", data: null };
  }

  let permissionIds: number[] = [];
  if (typeof permissionsRaw === "string") {
    try {
      const parsed = JSON.parse(permissionsRaw);
      if (Array.isArray(parsed)) permissionIds = parsed.map((x) => Number(x));
    } catch {
      // ignore
    }
  } else if (Array.isArray(permissionsRaw)) {
    permissionIds = permissionsRaw.map((x) => Number(x));
  }

  const permissionName = buildPermissionName(permissionIds);

  if (!Number.isNaN(idNum) && idNum > 0) {
    const exist = state.roles.find((r) => r.id === idNum);
    if (exist) {
      exist.name = name;
      exist.permission = permissionIds;
      exist.permissionName = permissionName;
      return { code: 10000, msg: "success", message: "success", data: null };
    }
  }

  const maxId = state.roles.reduce((m, r) => Math.max(m, r.id), 0);
  const newRoleId = maxId + 1;
  state.roles.push({
    id: newRoleId,
    name,
    permission: permissionIds,
    permissionName,
  });

  return { code: 10000, msg: "success", message: "success", data: null };
});

