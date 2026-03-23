import axios from "axios";
import { ElMessage } from "element-plus";
import router from '@/router'

const http = axios.create({
    baseURL: 'http://localhost:3001/v3pz',
    timeout: 10000
})

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在登录前将token通过localstorage缓存在浏览器中
    let token = localStorage.getItem('pz_token')
    // 开发环境：如果没有token，使用默认token
    if (!token && process.env.NODE_ENV === 'development') {
      token = "796be13b4e4f8c7d0383aafc7beed1c0"
    }
    const whiteUrl = ['/get/code', '/user/authentication', '/login']
    if (token && !whiteUrl.includes(config.url)) {
        config.headers['x-token'] = token
    }
    return config;
    }, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    if (response.data.code === -1) {
        ElMessage.warning(response.data.message)
    }
    // if (response.data.code === -2) {
    //     localStorage.removeItem('pz_token')
    //     localStorage.removeItem('pz_userInfo')
    //     router.replace('/login')
    // }
    return response;
    }, function (error) {
    return Promise.reject(error);
});

export default http


// message 是后端返回的提示信息
// {
//     "code": -1,
//     "message": "验证码错误，请重新输入",
//     "data": null
// }