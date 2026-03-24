export type PermissionNode = {
  id: number;
  label: string;
  children?: PermissionNode[];
};

export type Role = {
  id: number;
  name: string;
  permission: number[];
  permissionName: string;
};

export type User = {
  id: number;
  name: string;
  permissions_id: number;
  mobile: string;
  active: number; // 1: 正常, 0: 失效
  create_time: number;
};

export type Companion = {
  id: number;
  mobile: string;
  active: number; // 是否生效: 1生效, 0失效
  age: number;
  avatar: string;
  name: string;
  sex: string; // 性别: 1男, 2女
  create_time: number;
};

function flattenPermissions(nodes: PermissionNode[], out: Map<number, string>) {
  for (const n of nodes) {
    out.set(n.id, n.label);
    if (n.children?.length) flattenPermissions(n.children, out);
  }
}

export const permissionTree: PermissionNode[] = [
  {
    id: 1,
    label: "权限管理",
    children: [
      { id: 2, label: "账号管理" },
      { id: 3, label: "菜单管理" },
    ],
  },
  {
    id: 4,
    label: "DIDI陪诊",
    children: [
      { id: 5, label: "陪护管理" },
      { id: 6, label: "订单管理" },
    ],
  },
  {
    id: 7,
    label: "控制台",
  },
];

export const permissionIdToLabel = (() => {
  const map = new Map<number, string>();
  flattenPermissions(permissionTree, map);
  return map;
})();

export const state: {
  roles: Role[];
  users: User[];
  companions: Companion[];
  smsCodes: Record<string, string>;
} = {
  roles: [
    {
      id: 15,
      name: "DIDI",
      permission: [2, 4, 5, 3, 6, 7],
      permissionName: "权限管理,账号管理,菜单管理,DIDI陪诊,陪护管理,订单管理,控制台",
    },
  ],
  users: [
    {
      id: 105,
      name: "MU",
      permissions_id: 0,
      mobile: "13397101182",
      active: 1,
      create_time: 1721982053000,
    },
    {
      id: 106,
      name: "Jungwon",
      permissions_id: 15,
      mobile: "13800138000",
      active: 1,
      create_time: 1721982054000,
    },
    {
      id: 107,
      name: "SUGA",
      permissions_id: 15,
      mobile: "13800138002",
      active: 0,
      create_time: 1721982055000,
    },
  ],
  companions: [
    {
      id: 1,
      mobile: "13585254256",
      active: 1,
      age: 28,
      avatar: "http://159.75.169.224:5500/3.jpeg",
      name: "小王",
      sex: "2",
      create_time: Date.now(),
    },
    {
      id: 2,
      mobile: "13800138001",
      active: 1,
      age: 32,
      avatar: "http://159.75.169.224:5500/4.jpeg",
      name: "小李",
      sex: "1",
      create_time: Date.now() - 86400000,
    },
    {
      id: 3,
      mobile: "13800138002",
      active: 0,
      age: 25,
      avatar: "http://159.75.169.224:5500/5.jpeg",
      name: "小张",
      sex: "2",
      create_time: Date.now() - 172800000,
    },
  ],
  smsCodes: {},
};

export function buildPermissionName(permissionIds: number[]) {
  const labels: string[] = [];
  for (const id of permissionIds) {
    const label = permissionIdToLabel.get(id);
    if (!label) continue;
    labels.push(label);
  }
  // 去重并保持顺序
  const seen = new Set<string>();
  return labels.filter((x) => (seen.has(x) ? false : (seen.add(x), true)));
}

