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
      image: '/banner1.png',
      title: '专业陪诊服务',
    },
    {
      id: 2,
      image: '/banner2.png',
      title: '全天候在线预约',
    },
    {
      id: 3,
      image: '/banner3.png',
      title: '三甲医院合作',
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

  // 模拟导航数据
  const nav2s = [
    {
      id: 1,
      title: 'nav2s1',
      image: '/nav2s1.png'
    },
    {
      id: 2,
      title: 'nav2s2',
      image: '/nav2s2.png'
    }
  ];

  const hospitals = [
    {
      id: "0",
      name: "北京协和医院",
      address: "北京市东城区东单北大街1号",
      image: '/hospic1.png',
      intro: '百年协和，疑难重症诊疗高地，守护生命健康; 医教研并举，铸就医界标杆，守护万家安康'
    },
    {
      id: "1",
      name: "北京大学第一医院",
      address: "北京市西城区西什库大街8号",
      image: '/hospic2.png',
      intro: '厚德尚道，水准原点，百年初心护佑民生; 学科雄厚，精研医术，以仁心守护生命安康'
    },
    {
      id: "2",
      name: "北京朝阳医院",
      address: "北京市朝阳区工体南路8号",
      image: '/hospic3.png',
      intro: '呼吸危重症救治标杆，急诊急救守护平安; 三甲综合实力强劲，守护百姓呼吸与健康'
    },
    {
      id: "3",
      name: "北京天坛医院",
      address: "北京市丰台区南四环西路119号",
      image: '/hospic4.png',
      intro: '亚洲神经外科摇篮，精研脑病守护中枢; 神外领军，医技精湛，为大脑健康保驾护航'
    },
    {
      id: "4",
      name: "北京安贞医院",
      address: "北京市朝阳区安贞路2号",
      image: '/hospic5.png',
      intro: '心血管领域标杆，匠心守护心肺健康; 安于心，贞于医，以专业守护生命律动'
    }]

  // 返回首页数据
  return {
    code: 10000,
    message: 'success',
    data: {
      banners,
      recommend: recommendCompanions,
      notices,
      nav2s,
      hospitals,
      userInfo: {
        hasLogin: false, // 前端可根据token判断
        unreadCount: 3
      }
    }
  };
});