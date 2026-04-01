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

export type Order = {
  id: number;
  order_no: string;        // 订单编号
  user_id: number;         // 用户ID
  companion_id: number;    // 陪护师ID
  hospital_id: string;     // 医院ID
  hospital_name: string;   // 医院名称
  demand: string;          // 备注
  receiveAddress: string;  // 接送地址
  tel: string;            // 联系电话
  starttime: number;      // 服务开始时间（时间戳）
  state: number;          // 状态：1待支付、2待服务、3已完成、4已取消
  amount: number;         // 订单金额
  create_time: number;    // 创建时间
};

export type Hospital = {
  id: string;
  name: string;
  address: string;
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
  orders: Order[];
  hospitals: Hospital[];
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
  orders: [
    {
      id: 1,
      order_no: "DD202503290001",
      user_id: 106, // Jungwon用户
      companion_id: 1, // 小王
      hospital_id: "h001",
      hospital_name: "北京协和医院",
      demand: "需要陪护老人做体检",
      receiveAddress: "北京市东城区东单北大街1号",
      tel: "13800138000",
      starttime: Date.now() + 86400000, // 明天
      state: 1, // 待支付
      amount: 299.00,
      create_time: Date.now() - 86400000, // 昨天创建
    },
    {
      id: 2,
      order_no: "DD202503290002",
      user_id: 106, // Jungwon用户
      companion_id: 2, // 小李
      hospital_id: "h002",
      hospital_name: "北京大学第一医院",
      demand: "术后康复陪护",
      receiveAddress: "北京市西城区西什库大街8号",
      tel: "13800138000",
      starttime: Date.now() + 172800000, // 后天
      state: 2, // 待服务
      amount: 399.00,
      create_time: Date.now() - 43200000, // 半天前
    },
    {
      id: 3,
      order_no: "DD202503290003",
      user_id: 106, // Jungwon用户
      companion_id: 1, // 小王
      hospital_id: "h003",
      hospital_name: "北京朝阳医院",
      demand: "产检陪护",
      receiveAddress: "北京市朝阳区工体南路8号",
      tel: "13800138000",
      starttime: Date.now() - 86400000, // 昨天
      state: 3, // 已完成
      amount: 199.00,
      create_time: Date.now() - 172800000, // 两天前
    },
    {
      id: 4,
      order_no: "DD202503290004",
      user_id: 106, // Jungwon用户
      companion_id: 3, // 小张
      hospital_id: "h001",
      hospital_name: "北京协和医院",
      demand: "取消订单",
      receiveAddress: "北京市东城区东单北大街1号",
      tel: "13800138000",
      starttime: Date.now() + 259200000, // 三天后
      state: 4, // 已取消
      amount: 299.00,
      create_time: Date.now() - 21600000, // 6小时前
    },
  ],
  hospitals: [
    {
      id: "0",
      name: "北京协和医院",
      address: "北京市东城区东单北大街1号"
    },
    {
      id: "1",
      name: "北京大学第一医院",
      address: "北京市西城区西什库大街8号"
    },
    {
      id: "2",
      name: "北京朝阳医院",
      address: "北京市朝阳区工体南路8号"
    },
    {
      id: "3",
      name: "北京天坛医院",
      address: "北京市丰台区南四环西路119号"
    },
    {
      id: "4",
      name: "北京安贞医院",
      address: "北京市朝阳区安贞路2号"
    }
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

