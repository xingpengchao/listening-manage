<template>
<div class="container">
  <div>
    <p>请先完善个人信息</p>
      <p>学生姓名：{{$store.state.user.name}} 学号：{{$store.state.user.number}}</p>
      <div>
        <el-form :model="personalForm" value-width="50px" :rules="rules" ref="personalForm">
          <el-form-item label="你学习英语的时间有多长了?"  prop="studyTime">
            <el-select v-model="personalForm.studyTime" placeholder="请选择" label-width="50px">
              <el-option label="1-4年" value="1-4年"></el-option>
              <el-option label="5-8年" value="5-8年"></el-option>
              <el-option label="9-12年" value="9-12年"></el-option>
              <el-option label="13-26年" value="13-26年"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="你对英语感兴趣的程度：" prop="interestLevel">
            <el-select v-model="personalForm.interestLevel" placeholder="请选择" label-width="50px">
              <el-option label="非常不感兴趣" value="1"></el-option>
              <el-option label="不感兴趣" value="2"></el-option>
              <el-option label="较感兴趣" value="3"></el-option>
              <el-option label="非常感兴趣" value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="进入大学后，你所在的学校是否有开设专门的英语听力课程？" prop="isClass">
            <el-switch v-model="personalForm.isClass"></el-switch>
          </el-form-item>
          <el-form-item v-if="personalForm.isClass == true" label="所开设课程名称是：" prop="className">
            <el-input v-model="personalForm.className"  style="width: 210px;" placeholder="请输入"/>
          </el-form-item>
          <el-form-item v-if="personalForm.isClass == true" label="每周开设几节课听力课程" prop="classNumber" >
            <el-input v-model="personalForm.classNumber" style="width: 210px;" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="你每周接触英语听力的时间是多久？（包括做听力的时间、听英语电台、英语新闻、看英/美剧的时间）" prop="weeklyListeningTime">
            <el-select v-model="personalForm.weeklyListeningTime" placeholder="请选择" label-width="50px">
              <el-option label="0-2小时" value="0-2小时"></el-option>
              <el-option label="2-4小时" value="2-4小时"></el-option>
              <el-option label="4-6小时" value="4-6小时"></el-option>
              <el-option label="6-8小时" value="6-8小时"></el-option>
              <el-option label="8小时以上" value="8小时以上"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="你最喜欢的练习英语听力的方式是什么？" prop="practiceListeningMethods">
            <el-select v-model="personalForm.practiceListeningMethods" placeholder="请选择" label-width="50px">
              <el-option label="看英语新闻" value="看英语新闻"></el-option>
              <el-option label="看英/美剧" value="看英/美剧"></el-option>
              <el-option label="听英文歌" value="听英文歌"></el-option>
              <el-option label="实战做题" value="实战做题"></el-option>
              <el-option label="以上都不是" value="以上都不是"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="你认为你目前的英语听力能力处于什么水平？" prop="listeningAbility">
            <el-select v-model="personalForm.listeningAbility" placeholder="请选择" label-width="50px">
              <el-option label="初级：能够进行简单地对话和看懂简单的英文篇章" value="初级：能够进行简单地对话和看懂简单的英文篇章"></el-option>
              <el-option label="中级：能够较熟练地进行流利的口语交流并具备一定的听说读写能力" value="中级：能够较熟练地进行流利的口语交流并具备一定的听说读写能力"></el-option>
              <el-option label="高级：能够进行流利的口语交流并具备扎实的听说读写能力" value="高级：能够进行流利的口语交流并具备扎实的听说读写能力"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span class="dialog-footer">
        <el-button @click="">取消</el-button>
        <el-button type="primary" @click="clickConfirmButton">确认</el-button>
      </span>

  </div>

</div>
</template>

<script>
import {HttpManager} from "@/api";
import {CODE} from "@/resources/common";
import {ElMessage} from "element-plus";

export default {
  name: "PersonalCenter",
  data:()=> {
    return {
      personalFormDialogDisplay: true,
      dialogTitle: '请先完善个人信息',
      dialogWidth: "800px",
      personalForm: {
        studentName: "",
        studentNumber: "",
        filled: 0,  //是否填写，0未填写，1表示已填
        studyTime: '',  //学习英语多长时间
        interestLevel: '', //对英语的感兴趣程度
        isClass:false,  //进大学后学校是否开设课程
        weeklyListeningTime: '',//每周英语听力时长
        practiceListeningMethods: '',//练习英语听力的方法
        listeningAbility: '',//听力能力处于什么水平
        className: '' ,//进大学后学校开设课程,课程名称
        classNumber: '', //课程每周开设几节
      } ,
      rules: {
        studyTime: [{ required: true, message: "该项不能为空", trigger: "change" }],
        interestLevel: [{ required: true, message: "该项不能为空", trigger: ["blur",'change'] }],
        weeklyListeningTime: [{ required: true, message: "该项不能为空", trigger: ["blur",'change'] }],
        practiceListeningMethods: [{ required: true, message: "该项不能为空", trigger: ["blur",'change'] }],
        listeningAbility: [{ required: true, message: "该项不能为空", trigger: ["blur",'change'] }],
        className: [{ required: true, message: "该项不能为空", trigger: ["blur",'change'] }],
        classNumber: [{ required: true, message: "该项不能为空", trigger: ["blur",'change'] }],
      }
    }

  },
  methods:{
    clickConfirmButton(){
      const params = {
        //还需要将studentName  studentNumber这两个值从登录页面传过来，和personalForm中的值一起传到数据库中
        //目前还没有实现
          personalId:3,
        studentName: '0419',
        studentNumber: '0419',
        studyTime: this.personalForm.studyTime,
        interestLevel: this.personalForm.interestLevel,
        isClass: this.personalForm.isClass,
        weeklyListeningTime: this.personalForm.weeklyListeningTime,
        practiceListeningMethods: this.personalForm.practiceListeningMethods,
        listeningAbility: this.personalForm.listeningAbility,
        className: this.personalForm.className,
        classNumber: this.personalForm.classNumber,
      }
        console.log(params)
        HttpManager.addStudentInfo(params)
            .then((res) => {
                console.log(res.code)
                if(res.code == CODE.OK_200){
                    ElMessage.success(res.msg)
                    // this.studentDialogDisplay = false
                    // this.$emit("closeDialog", this.studentDialogDisplay)
                }else {
                    ElMessage.error(res.msg)
                    ElMessage.error("这块错了1 ")
                    console.log(res.code)
                }
            }).catch((error) => {
            console.log("这块错了2")
            ElMessage.error('服务器错误')
        })
        this.$refs['personalForm'].validate((valid)=>{
            if(valid){
                console.log("提交")
            }else{
                console.log("取消")
            }
        })
        console.log(params)
    }
  }
}
</script>

<style scoped>

</style>