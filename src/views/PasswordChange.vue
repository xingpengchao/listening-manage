<template>
    <div class="container">
        <el-form  :model="formData" label-width="120px" class="change-password">
            <h2>修改密码</h2>
            <el-form-item label="旧密码" prop="oldPassword">
                <el-input type="password" v-model="formData.oldPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
                <el-input type="password" v-model="formData.newPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
                <el-input type="password" v-model="formData.confirmPassword" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleChangePassword">确认修改</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import {HttpManager} from "@/api";
import {CODE} from "@/resources/common";
import {ElMessage} from "element-plus";


export default {
    name: "PasswordChange",
    data:()=> {
        return {
            formData: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
        }

    },
    methods:{
        handleChangePassword() {

        }
    },
    mounted() {
        // 在组件挂载时添加表单验证规则
        // this.$refs.form.addRule('confirmPassword', (rule, value, callback) => {
        //     if (value !== this.formData.newPassword) {
        //         callback(new Error('两次输入的密码不一致'));
        //     } else {
        //         callback();
        //     }
        // });
    }
}
</script>

<style scoped>

</style>