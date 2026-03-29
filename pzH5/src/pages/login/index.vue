<template>
    <h1>用户登录</h1>
    <van-form @submit="onSubmit">
        <van-cell-group inset>
            <van-field
            v-model="form.userName"
            name="username"
            label="用户名"
            placeholder="用户名"
            :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
            v-model="form.passWord"
            type="password"
            name="password"
            label="密码"
            placeholder="密码"
            :rules="[{ required: true, message: '请填写密码' }]"
            />
        </van-cell-group>
        <div class="btn">
            <van-button native-type="submit" round block type="primary">提交</van-button>
        </div>
    </van-form>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
// 获取当前vue实例
const { proxy } = getCurrentInstance()

// 表单数据
const form = reactive({
    userName: '',
    passWord: ''
}) 

// 表单提交
const onSubmit = async () => {
    try {
        console.log('提交登录表单', form)
        const response = await proxy.$api.login(form)
        console.log('登录响应', response)
        const { data } = response
        console.log('响应数据', data)
        if (data.code === 10000) {
            localStorage.setItem('h5_token', data.data.token)
            localStorage.setItem('h5_userInfo', JSON.stringify(data.data.userInfo))
            router.push('/home')
        } else {
            console.error('登录失败，code:', data.code, 'msg:', data.msg || data.message)
        }
    } catch (error) {
        console.error('登录请求失败', error)
    }
}
</script>

<style lang="less" scoped>
h1 {
    text-align: center;
}
.btn {
    margin: 16px;
}
</style>