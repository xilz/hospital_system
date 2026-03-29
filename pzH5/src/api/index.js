import request from '../utils/request'

export default {
    login(data) {
        return request.post('login', data)
    },
    // H5首页
    getHomeData() {
        return request.get('h5/home')
    },
    // 陪护师列表
    getCompanionList(params) {
        return request.get('h5/companion', { params })
    },
    // 创建订单
    createOrder(data) {
        return request.post('createOrder', data)
    },
    // 订单列表
    getOrderList(params) {
        return request.get('order/list', { params })
    },
    // 订单详情
    getOrderDetail(params) {
        return request.get('order/detail', { params })
    }
}