<template>
  <div class="header">
    <div class="collapse-btn" @click="collapseChange">
      <el-icon v-if="!collapse"><expand /></el-icon>
      <el-icon v-else><fold /></el-icon>
    </div>
    <div class="logo" v-if="userId === '1'">{{ systemName.teacher }}</div>
    <div class="logo" v-else>{{ systemName.student }}</div>
    <div class="header-right">
      <div class="header-user-con">
        <div>
          <el-icon><Avatar /></el-icon>
        </div>
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ userInfo.userName }}
            <el-icon><ArrowDown /></el-icon>
            <i class="el-icon-caret-bottom"></i>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>

import { Expand, Fold, Avatar } from "@element-plus/icons-vue";
import {mapState} from "vuex";
import Cookies from "js-cookie";

export default {
  data: () => {
    return {
      userInfo: {}, 
      userId: '0',  // 0 代表学生  1代表教师
    }
  },
  created() {
    // if(!this.loginStatus) {
    //   const status = sessionStorage.getItem("loginStatus")
    //   this.$store.commit('updateLoginStatus', status)
    // }

    this.userId = sessionStorage.getItem("userId")
    this.userInfo = JSON.parse(sessionStorage.getItem("ersnfo"))
  },
  methods: {
    collapseChange() {
      this.$store.commit('updateCollapse', !this.$store.state.collapse)
    },
    handleCommand(command) {
      if (command === "logout") {
        //清除token
        Cookies.remove('token')
        
        // 清除SessionStorage
        const list = ['userId', 'ersnfo', 'ADMIN_SERVER']
        list.forEach(item => sessionStorage.removeItem(item))
        
        this.$router.push("/");
      }
    }
  },
  computed: {
    ...mapState(['loginStatus','systemName','collapse'])
  }
}
</script>

<style scoped>
.header {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #2c3e50;
  background: #ffff;
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.3);
}

.collapse-btn {
  display: flex;
  padding: 0 21px;
  cursor: pointer;
}
.header .logo {
  width: 300px;
  font-weight: bold;
}

.header-right {
  position: absolute;
  right: 0;
  padding-right: 30px;
}

.header-user-con {
  display: flex;
  align-items: center;
}

.user-name {
  margin-left: 10px;
}

.el-dropdown-link {
  cursor: pointer;
}


</style>