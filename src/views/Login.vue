<template>
  <div class="login-container">
    <div class="title">{{ $store.state.systemName.index }}</div>
    <div class="login">
      <el-form :model="loginForm" :rules="rules">
<!--          loginform是一个data,需要在script中定义-->
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="loginForm.status">
            <el-radio :label="false">学生</el-radio>
            <el-radio :label="true">教师</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button class="login-btn" type="primary" @click="submitLoginForm">登录</el-button>
<!--            最后提交表单信息-->

        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import  { ElMessage } from 'element-plus'
  import { HttpManager } from '@/api/index'
  import {CODE} from "@/resources/common";
  import {setToken} from "@/utils/cookie"
  import Mock from 'mockjs'
  import Cookie from 'js-cookie'
  import axios from "axios";
  import {get} from "@/api/http";
  import {mapActions, mapState} from "vuex";



  export default {
    data: ()=> {
      return {
        loginForm: {
          userName: "",
          password: "",
          status: false
        },
        rules: {
          userName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
          password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        //     trigger代表失去焦点时处罚规则，即弹出“请输入用户名”
        },
        userId: '0', // 0 代表学生  1代表教师
      }
    },
    methods: {

        submitLoginForm() {
          let params = {
            userName: this.loginForm.userName,
            password: this.loginForm.password,
            status: this.loginForm.status
          }
          // *****
          HttpManager.getLoginStatus(params)//提交params
        .then((res) => {//res代表getLoginStatus的返回值
          if(res.code == CODE.OK_200){
            const user = { id: '', name: '', number: ''}

            // 登录成功，this.loginForm.status为true
            this.loginForm.status = !this.loginForm.status

            this.$store.commit('updateLoginStatus', this.loginForm.status)
            // sessionStorage.setItem("loginStatus", this.loginForm.status)
          
            // 学生
            this.userId = this.loginForm.userName === '0418' ? '0' : '1'
            sessionStorage.setItem("userId", this.userId)

            if(this.userId === 0){
              sessionStorage.setItem("ersnfo", JSON.stringify(this.loginForm))
              user.id = this.loginForm.userName
              user.number = this.loginForm.userName
              user.name = this.loginForm.userName
              const token= Mock.Random.guid()
              Cookie.set('token',token)

              this.$router.push("/student/examination");
            } else {
              // 教师
              user.id = "1"
              user.number = "04160000"
              user.name = this.loginForm.userName
              sessionStorage.setItem("ADMIN_SERVER", params.userName)
              sessionStorage.setItem("ersnfo", JSON.stringify(this.loginForm))
              const token= Mock.Random.guid()
              Cookie.set('token',token)
              this.$router.push("/examination");
              console.log(this.loginStatus)
            }
            this.$store.commit('updateUser',user);
            ElMessage.success('登陆成功')


            // if(this.loginForm.status === false){
            //   sessionStorage.setItem("ersnfo", JSON.stringify(this.loginForm))
            //   user.id = this.loginForm.userName
            //   user.number = this.loginForm.userName
            //   user.name = this.loginForm.userName
            //   this.$router.push("/student/examination");
            //     const token= Mock.Random.guid()
            //     Cookie.set('token',token)
            //     // this.$router.push("/home");
            //   console.log(this.loginStatus)
            // }else if(this.loginForm.status === true){
            //   user.id = "1"
            //   user.number = "04160000"
            //   user.name = this.loginForm.userName
            //     sessionStorage.setItem("ADMIN_SERVER", params.userName)
            //     sessionStorage.setItem("ersnfo", JSON.stringify(this.loginForm))
            //     const token= Mock.Random.guid()
            // Cookie.set('token',token)
            //     this.$router.push("/examination");
            //     console.log(this.loginStatus)
            // }
            // this.$store.commit('updateUser',user);
            // ElMessage.success(res.msg)
          }else {
            ElMessage.error(res.msg)
          }
        }).catch((error) => {
            console.log(params)
          ElMessage.error('服务器错误')
            console.log("错了")
            console.log(error)
            console.log(params)
        })
      }
    },
      computed:{
          ...mapState(['loginStatus']),
      }
  }
</script>

<style scoped>
.login-container {
  position: fixed;
  background: url("../assets/images/background.jpg") fixed center;
  background-size: cover;
  width: 100%;
  height: 100%;
}

.title {
  position: absolute;
  top: 50%;
  width: 100%;
  margin-top: -230px;
  text-align: center;
  font-size: 30px;
  font-weight: 600;
  color: #fff;
}

.login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 300px;
  margin: -150px 0 0 -190px;

  padding: 40px;
  border-radius: 5px;
  background: #fff;
}

.login-btn {
  width: 100%;
}
</style>
