import axios from "axios";

const http = axios.create({
    baseURL: 'http://localhost:3001/v3pz',
    timeout: 10000,
    headers: { "terminal": "h5" }
})

// 添加请求拦截器
http.interceptors.request.use(function (config) {
    // 在登录前将token通过localstorage缓存在浏览器中
    let token = localStorage.getItem('h5_token')
    // 开发环境：如果没有token，使用默认token
    if (!token && process.env.NODE_ENV === 'development') {
      token = "796be13b4e4f8c7d0383aafc7beed1c0"
    }
    const whiteUrl = ['login']
    if (token && !whiteUrl.includes(config.url)) {
        config.headers['h-token'] = token
    }
    return config;
    }, function (error) {
    return Promise.reject(error);
});

// 添加响应拦截器
http.interceptors.response.use(function (response) {
    if (response.data.code === -1) {

    }
    return response;
    }, function (error) {
    return Promise.reject(error);
});

export default http