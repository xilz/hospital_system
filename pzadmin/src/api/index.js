import request from '../utils/request'

// 发送验证码
export const getCode = (data) => {
    return request.post('/get/code', data)
}

// 注册用户
export const userAuthentication = (data) => {
    return request.post('/user/authentication', data)
}

// 登录
export const userLogin = (data) => {
    return request.post('/login', data)
}

// 权限管理列表
export const authAdmin = (params) => {
    return request.get('/auth/admin', { params })
}

// 菜单权限数据
export const userGetMenu = () => {
    return request.get('/user/getmenu')
}

// 菜单权限修改
export const userSetMenu = (data) => {
    return request.post('/user/setmenu', data)
}

// 菜单权限列表
export const menuList = (params) => {
    return request.get('/menu/list', { params })
}

// 菜单权限选择列表
export const menuSelectList = () => {
    return request.get('/menu/selectlist')
}

// 用户权限修改
export const updateUser = (data) => {
    return request.post('/update/user', data)
}

// 用户菜单权限
export const menuPermissions = () => {
    return request.get('/menu/permissions')
}

// 陪护师头像列表
export const photoList = () => {
    return request.get('/photo/list')
}

// 陪护师列表
export const companionList = (params) => {
    return request.get('/companion/list', { params })
}

// 陪护师创建
export const createCompanion = (data) => {
    return request.post('/companion', data)
}

// 陪护师删除
export const deleteCompanion = (data) => {
    return request.post('/delete/companion', data)
}