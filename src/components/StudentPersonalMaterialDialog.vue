<template>
<div>
  <el-dialog v-model="studentPersonalMaterialDialogDisplay" title="学生个人资料" :width="dialogWidth" @close="studentPersonalMaterialDialogDialogClose">
    <div>
      <el-tabs type="border-card">
          <el-form :model="personalForm" v-if="this.personalForm.filled == 1" disabled="true" >
            <el-form-item label="姓名" label-width="">
              <el-input v-model="personalForm.studentName" autocomplete="off" />
            </el-form-item>
            <el-form-item label="学号" label-width="">
              <el-input v-model="personalForm.studentNumber" autocomplete="off" />
            </el-form-item>
            <el-form-item label="学习英语的时间" label-width="">
              <el-input v-model="personalForm.studyTime" autocomplete="off" />
            </el-form-item>
            <el-form-item label="对英语感兴趣的程度" label-width="">
              <el-input  v-model="chineseNumber" autocomplete="off" />

            </el-form-item>
            <el-form-item label="所在的学校是否有开设专门的英语听力课程" label-width="" :formatter="formatPrivilegeType">
              <el-input v-model="personalForm.isClass" autocomplete="off" />
            </el-form-item>
            <el-form-item v-if="personalForm.isClass == true" label="所开设课程名称是：">
              <el-input v-model="personalForm.className"/>
            </el-form-item>
            <el-form-item v-if="personalForm.isClass == true" label="每周开设几节课听力课程">
              <el-input v-model="personalForm.classNumber" />
            </el-form-item>
            <el-form-item label="每周接触英语听力的时间" label-width="">
              <el-input v-model="personalForm.weeklyListeningTime" autocomplete="off" />
            </el-form-item>
            <el-form-item label="喜欢的练习英语听力的方式" label-width="">
              <el-input v-model="personalForm.practiceListeningMethods" autocomplete="off" />
            </el-form-item>
            <el-form-item label="目前的英语听力能力处于的水平" label-width="">
              <el-input v-model="personalForm.listeningAbility" autocomplete="off" />
            </el-form-item>
          </el-form>
        <el-form :model="personalForm" v-if="this.personalForm.filled == 0">
          <span>该生还没有填写个人资料</span>
        </el-form>
      </el-tabs>
    </div>
  </el-dialog>
</div>
</template>

<script>

export default {
  name: "StudentPersonalMaterialDialog",
  props: {
    isShowDialog: {
      type: Boolean,
      default: false
    },
      personalMaterial:{

      },
    dialogFlag: {
      type: String,
      default: "add"
    },
    studentData: {
      type: Object,
      required: false,
    },

  },
  watch: {//watch用于组件属性监控
    isShowDialog: {
      handler(newValue, oldValue) {
        this.studentPersonalMaterialDialogDisplay = newValue
      },
      deep: true
    },
    studentData: {
      handler(newValue, oldValue) {
        if (newValue && newValue.studentName && newValue.studentNumber) {
          this.editStudentForm.sid = newValue.sid
          this.editStudentForm.name = newValue.studentName
          this.editStudentForm.number = newValue.studentNumber
        }
      },
      deep: true
    }
  },
  data() {
    return {
      studentPersonalMaterialDialogDisplay: false,
      dialogWidth: "800px",
      studentForm: {
        name: "",
        number: ""
      },
      personalForm: {
        studentName: "",
        studentNumber: "",
        filled: '',  //是否填写，0未填写，1表示已填
        studyTime: "",  //学习英语多长时间
        interestLevel: null, //对英语的感兴趣程度
        isClass:false,  //进大学后学校是否开设课程
        weeklyListeningTime: "",//每周英语听力时长
        practiceListeningMethods: "",//练习英语听力的方法
        listeningAbility: "",//听力能力处于什么水平
        className: '' ,//进大学后学校开设课程,课程名称
        classNumber: '', //课程每周开设几节
      },
      editStudentForm: {
        sid: 0,
        name: "",
        number: ""
      },
      number:0,
        chineseNumbers: ["很感兴趣", "感兴趣", "不感兴趣", "很不感兴趣"]
    }
  },
  methods: {
      closeDialog:()=>{
          },
    formatPrivilegeType(){
      if(this.personalForm.isClass == false){
        return '否'
      } else if(this.personalForm.isClass) {
        return '是'
      }
    },
    studentPersonalMaterialDialogDialogClose() {
      this.studentPersonalMaterialDialogDisplay = false
      this.$emit("closeDialog", this.studentPersonalMaterialDialogDisplay)
    },
  },
    computed:{
      chineseNumber(){
          this.number = this.personalForm.interestLevel
          return this.chineseNumbers[this.number]
      }
    }
}
</script>

<style scoped>

</style>
