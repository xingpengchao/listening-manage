<template>
  <div class="sidebar">
    <el-menu
        v-if="userId === '1'"
        class="sidebar-el-menu"
        background-color="#ffffff"
        active-text-color="#30a4fc"
        :default-active="activeMenuIndex"
        :collapse="$store.state.collapse"
        router>
      <el-menu-item index="examination">
        <el-icon><Document /></el-icon>
        <span>考试信息</span>
      </el-menu-item>

        <el-menu-item index="paperview">
            <el-icon><Paperclip /></el-icon>
            <span>试卷库</span>
        </el-menu-item>

        <el-menu-item index="question">
            <el-icon><Paperclip /></el-icon>
            <span>编辑试题</span>
        </el-menu-item>

      <el-menu-item index="score">
        <el-icon><ZoomIn /></el-icon>
        <span>查看成绩</span>
      </el-menu-item>
      <el-menu-item index="class">
        <el-icon><User /></el-icon>
        <span>学生管理</span>
      </el-menu-item>
      <el-menu-item index="feedback">
        <el-icon><Tickets /></el-icon>
        <span>反馈信息</span>
      </el-menu-item>
    </el-menu>

    <el-menu
        v-if="userId === '0'"
        class="sidebar-el-menu"
        background-color="#ffffff"
        active-text-color="#30a4fc"
        default-active="examinationInfo"
        :collapse="$store.state.collapse"
        @select="handleSelect">
      <el-menu-item index="examinationInfo">
        <el-icon><Document /></el-icon>
        <span>考试信息</span>
      </el-menu-item>
      <el-menu-item index="myExamination">
        <el-icon><Tickets /></el-icon>
        <span>我的考试</span>
      </el-menu-item>
      <el-menu-item index="personalCenter">
        <el-icon><Tickets /></el-icon>
        <span>个人中心</span>
      </el-menu-item>
        <el-menu-item index="passwordChange">
            <el-icon><Tickets /></el-icon>
            <span>修改密码</span>
        </el-menu-item>
    </el-menu>
  </div>
</template>

<script>

import { Document, Paperclip, ZoomIn, User, Tickets } from "@element-plus/icons-vue";
import  { mapState } from 'vuex'
import Cookies from "js-cookie";

export default {
    data: () => {
    return {
      userId: '0',  // 0 代表学生  1代表教师
      items:[
        {
          icon: 'el-icon-document',
          index: 'examination',
          title: '考试信息'
        },
        {
          icon: 'el-icon-document',
          index: 'paper',
          title: '上传试题'
        },
        {
          icon: 'el-icon-document',
          index: 'score',
          title: '查看成绩'
        },
        {
          icon: 'el-icon-document',
          index: 'student',
          title: '学生管理'
        },
        {
          icon: 'el-icon-document',
          index: 'feedback',
          title: '反馈信息'
        },
      ]
    }
  },
  methods: {
    handleSelect(index) {
      if(index == 'examinationInfo') {
        this.$router.push("/student/examination");
      } else if (index == 'myExamination') {
        this.$router.push("/student/my/examination");
      } else if (index == 'personalCenter'){
        this.$router.push("/student/personalCenter");
      }
      else if (index=='passwordChange'){
          console.log('00990')
          this.$router.push("/student/passwordChange");
      }
    }
  },
  computed: {
    // ...mapState(['loginStatus']),
    activeMenuIndex() {
      return this.$route.path.replace("/", "")
    }
  },
  mounted() {
    this.userId =  sessionStorage.getItem("userId")
    
    // 路由初始化根据角色判断
    const path = this.userId === '0' ? '/student/examination' : '/examination'
    this.$router.push(path)
  },
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 60px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar > ul {
  height: 100%;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 150px;
}
</style>
