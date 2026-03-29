import { defineEventHandler } from 'h3';
import { state } from '../_utils/mock-db';

export default defineEventHandler(async (event) => {
  // 获取活跃的陪护师作为推荐
  const recommendCompanions = state.companions
    .filter(c => c.active === 1)
    .slice(0, 4) // 取前4个
    .map(c => ({
      id: c.id,
      name: c.name,
      avatar: c.avatar,
      age: c.age,
      sex: c.sex === '1' ? '男' : '女',
    }));

  // 模拟横幅数据
  const banners = [
    {
      id: 1,
      image: 'https://example.com/banner1.jpg',
      title: '专业陪诊服务',
      link: '/service'
    },
    {
      id: 2,
      image: 'https://example.com/banner2.jpg',
      title: '全天候在线预约',
      link: '/appointment'
    },
    {
      id: 3,
      image: 'https://example.com/banner3.jpg',
      title: '三甲医院合作',
      link: '/hospitals'
    }
  ];

  // 模拟通知数据
  const notices = [
    {
      id: 1,
      title: '系统维护通知',
      content: '本周六凌晨2点至4点进行系统维护',
      time: '2026-03-28'
    },
    {
      id: 2,
      title: '新功能上线',
      content: '在线支付功能已全面上线',
      time: '2026-03-25'
    },
    {
      id: 3,
      title: '优惠活动',
      content: '新用户首单立减50元',
      time: '2026-03-20'
    }
  ];

  // 返回首页数据
  return {
    code: 10000,
    message: 'success',
    data: {
      banners,
      recommend: recommendCompanions,
      notices,
    }
  };
});