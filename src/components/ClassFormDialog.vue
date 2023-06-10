<template>
    <div>
        <el-dialog v-model="classDialogDisplay" :title="dialogTitle" :width="dialogWidth" @close="classDialogClose">
            <div v-if="dialogFlag == 'add'">
                <el-form :v-model="className">
                    <el-form-item label="班级" label-width="40px">
                        <el-input v-model="className" autocomplete="off" />
                    </el-form-item>
                </el-form>
            </div>
            <div v-else>
                <el-form :v-model="editClass">
                    <el-form-item label="班级" label-width="40px">
                        <el-input v-model="editClass.className" autocomplete="off" />
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
export default {
    name: "ClassFormDialog",
    props: {
        isShowDialog: {
            type: Boolean,
            default: false
        },
        dialogFlag: {
            type: String,
            default: "add"
        },
        studentData:{
            type: Object,
            required:false,
        }
    },

    watch: {
        isShowDialog: {
            handler(newValue, oldValue) {
                this.classDialogDisplay = newValue
            },
            deep: true
        },
        studentData: {
            handler(newValue, oldValue) {
                this.editClass.classId = newValue.classId
                // console.log(this.editClass.classId)
                this.editClass.className = newValue.className
                // console.log(this.editClass.className)
                // console.log("1244555")
            },
            deep: ""
        },
    },
    data() {
        return {
            classDialogDisplay: false,
            dialogWidth: "412px",
            className:'',
            editClass: {
                classId: "",
                className: "",
            },
        }
    },
    methods: {
        classDialogClose() {
            this.classDialogDisplay = false
            this.$emit("closeDialog", this.classDialogDisplay)
        },
        clickCancelButton() {
            this.classDialogDisplay = false
            this.$emit("closeDialog", this.classDialogDisplay)//this.$emit用于修改父组件的
        },
        clickConfirmButton() {
            if(this.dialogFlag == "add"){
                console.log(this.className)
                const params = {
                    className: this.className
                }
                console.log(params)
                HttpManager.setClasses(params)
                    .then((res) => {
                        // console.log(res.code)
                        if(res.code == CODE.OK_200){
                            ElMessage.success(res.msg)
                            this.studentDialogDisplay = false
                            this.$emit("closeDialog", this.classDialogDisplay)
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
                console.log(this.editClass.className+"512")
                const params = {
                    classId: this.editClass.classId,
                    className: this.editClass.className,

                }
                console.log(params)
                HttpManager.updateStudentClass(params)
                    .then(res => {
                        if(res.code == CODE.OK_200){
                            console.log(res)
                            console.log('here')
                            this.classDialogDisplay = false
                            this.$emit("closeDialog", this.classDialogDisplay)
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
                return "添加班级"
            } else if (this.dialogFlag == "edit") {
                this.dialogWidth = "380px"
                return "修改班级信息"
            } else {
                return ""
            }
        },
    }
}
</script>

<style scoped>

</style>
