<template>
  <div>
    <el-dialog v-model="studentDialogDisplay" :title="dialogTitle" :width="dialogWidth" @close="studentDialogClose">
      <div v-if="dialogFlag == 'add'">
        <el-tabs type="border-card">
          <el-tab-pane label="添加一个">
            <el-form :model="studentForm">
              <el-form-item label="姓名" label-width="40px">
                <el-input v-model="studentForm.name" autocomplete="off" />
              </el-form-item>
              <el-form-item label="学号" label-width="40px">
                <el-input v-model="studentForm.number" autocomplete="off" />
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="批量添加">批量添加</el-tab-pane>
        </el-tabs>
      </div>
      <div v-else>
        <el-form :model="editStudentForm">
          <el-form-item label="姓名" label-width="40px">
            <el-input v-model="editStudentForm.name" autocomplete="off" />
          </el-form-item>
          <el-form-item label="学号" label-width="40px">
            <el-input v-model="editStudentForm.number" autocomplete="off" />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="clickCancelButton">取消</el-button>
          <el-button type="primary" @click="clickConfirmButton">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { HttpManager } from '../api/index'
import {ElMessage} from "element-plus";
import {CODE} from "@/resources/common";
import {string} from "mockjs/src/mock/random/basic";
export default {
  name: "StudentFormDialog",
  props: {
    isShowDialog: {
      type: Boolean,
      default: false
    },
    dialogFlag: {
      type: String,
      default: "add"
    },
    studentData: {
      type: Object,
      required: false,
    },
      className:{
        type: String,
          default: "",
      }
  },

  watch: {
    isShowDialog: {
      handler(newValue, oldValue) {
        this.studentDialogDisplay = newValue
          console.log(this.className)
      },
      deep: true
    },
    studentData: {
      handler(newValue, oldValue) {
        if (newValue && newValue.sid && newValue.studentName && newValue.studentNumber) {
            console.log(newValue.sid)
          this.editStudentForm.sid = newValue.sid
          this.editStudentForm.name = newValue.studentName
          this.editStudentForm.number = newValue.studentNumber
          this.editStudentForm.password=newValue.studentNumber
        }
      },
      deep: true
    },
  },
  data() {
    return {
      studentDialogDisplay: false,
      dialogWidth: "412px",
      studentForm: {
          className: '',
        name: "",
        number: "",
        password:""
      },
      editStudentForm: {
        sid: "",
        name: "",
        number: "",
        password:""
      },
    }
  },
  methods: {
    studentDialogClose() {
        this.studentForm = {}
      this.studentDialogDisplay = false
      this.$emit("closeDialog", this.studentDialogDisplay)
    },
    clickCancelButton() {
      this.studentDialogDisplay = false
      this.$emit("closeDialog", this.studentDialogDisplay)//this.$emit用于修改父组件的
    },
    clickConfirmButton() {
      if(this.dialogFlag == "add"){
          console.log(this.className)
        const params = {
            studentClass: this.className,
            studentName: this.studentForm.name,
            studentNumber: this.studentForm.number,
            studentPassword: this.studentForm.number
        }
          console.log(params)
          console.log("502")
        HttpManager.addSingleStudent(params)
        .then((res) => {
            console.log(res.code)
            if(res.code == CODE.OK_200){
                ElMessage.success(res.msg)
                this.studentDialogDisplay = false
            this.$emit("closeDialog", this.studentDialogDisplay)
          }else {
            ElMessage.error(res.msg)
              ElMessage.error("这块错了1 ")
            console.log(res.code)
          }
        }).catch((error) => {
            console.log("这块错了2")
          ElMessage.error('服务器错误')
        })
      }
      else if(this.dialogFlag == "edit"){
        const params = {
          sid: this.editStudentForm.sid ,
          studentName: this.editStudentForm.name,
          studentNumber: this.editStudentForm.number,
          studentPassword: this.editStudentForm.number
        }
        console.log(params)
        console.log("111111")
        HttpManager.editSingleStudent(params)
        .then(res => {
          if(res.code == CODE.OK_200){
            console.log(res)
             console.log('here')
            this.studentDialogDisplay = false
            this.$emit("closeDialog", this.studentDialogDisplay)
          }else {
            ElMessage.error(res.msg)
              console.log("here1")
          }
        }).catch((error) => {
          ElMessage.error('服务器错误')
            console.log("here2")
        })
      }
    }



  },//methonds
  computed: {
    dialogTitle() {
      if(this.dialogFlag == "add") {
        this.dialogWidth = "412px"
        return "添加学生"
      } else if (this.dialogFlag == "edit") {
        this.dialogWidth = "380px"
        return "编辑学生信息"
      } else {
        return ""
      }
    },
  }
}
</script>

<style scoped>

</style>
