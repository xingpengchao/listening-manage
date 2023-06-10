<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="danger" @click="batchDeleteStudent">批量删除</el-button>
            <el-input placeholder="按学生名进行关键字搜索" v-model="searchKey" style="width: 200px; margin: 0 12px"></el-input>
            <el-button type="primary" @click="searchStudent">搜索</el-button>
            <el-button type="primary" @click="clickAddStudentButton">添加学生</el-button>
        </div>
        <el-table :data="studentList" max-height="421" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="studentName" label="姓名" width="300" />
            <el-table-column prop="studentNumber" label="学号" width="300" />
            <el-table-column prop="studentNumber" label="密码" width="300" />
            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-button type="primary" @click="clickEditStudentButton(scope.row)">编辑</el-button>
                    <el-button type="danger" @click="clickDeleteStudentButton(scope.row.sid)">删除</el-button>
                    <el-button type="primary" @click="clickViewPersonalMaterialButton(scope.row.sid)">查看个人资料</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="pagination"
                background
                layout="total, prev, pager, next"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="totalCount"
                @current-change="handleCurrentChange" >
        </el-pagination>
        <StudentFormDialog
                :is-show-dialog="studentDialogDisplay"
                :dialog-flag="dialogFlag"
                :student-data="currentEditData"
                @closeDialog="closeDialogHandle"></StudentFormDialog>
        <StudentPersonalMaterialDialog
                :isShowDialog="studentPersonalMaterialDialogDisplay"
                :personal-material="currentPersonalMaterial"
                @closeDialog="closeDialog"></StudentPersonalMaterialDialog>
        <el-dialog
                v-model="deleteConfirmFlag"
                width="281px"
                center>
            <span>删除之后数据不可恢复，确认删除吗?</span>
            <template #footer>
      <span class="dialog-footer">
        <el-button @click="clickDeleteCancelButton">取消</el-button>
        <el-button type="primary" @click="clickDeleteConfirmButton">确认</el-button>
      </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import  { mapState, mapMutations, mapActions } from 'vuex'
import StudentFormDialog from "@/components/StudentFormDialog";
import StudentPersonalMaterialDialog from "@/components/StudentPersonalMaterialDialog";
import {HttpManager} from "@/api/index";
import {ElMessage} from "element-plus";
import {CODE} from "@/resources/common";
export default {
    components: {
        StudentFormDialog,
        StudentPersonalMaterialDialog,
    },
    data: () => {
        return {
            totalCount: 0,
            searchKey: '',
            studentDialogDisplay: false,
            deleteConfirmFlag: false,
            formLabelWidth: "140px",
            currentPage: 1,
            pageSize: 8,
            dialogFlag: "add",
            currentEditData: {} ,// 当前编辑的是哪一个学生对象
            deleteStudentId: 0,
            selectedIds: [],
            studentPersonalMaterialDialogDisplay:false,
            currentPersonalMaterial:{}, //当前查看的是哪一个学生对象的个人资料
            studentForm:{studentName:String,
                studentNumber:String,
                studentPassword:String
            }

        }
    },
    created() {
        this.getTableData()
    },
    methods: {
        ...mapActions(['getStudentList','getPersonalMessageListByStudentNumber']),
        batchDeleteStudent() {
            if(this.selectedIds.length > 0){
                this.deleteStudentId = 0
                this.deleteConfirmFlag = true
            }else{
                ElMessage.warning('你还没有选择要删除的数据!')
            }
        },
        searchStudent() {
            this.getTableData(this.searchKey)
        },
        clickAddStudentButton() {
            this.studentDialogDisplay = true
            this.dialogFlag = "add"
        },
        clickViewPersonalMaterialButton(student){
            this.currentPersonalMaterial = student
            this.studentPersonalMaterialDialogDisplay = true
            console.log(this.currentPersonalMaterial)
        },
        closeDialog(isDisplay) {
            this.studentPersonalMaterialDialogDisplay = isDisplay
        },
        clickEditStudentButton(student) {
            this.currentEditData = student
            this.studentDialogDisplay = true
            this.dialogFlag = "edit"
        },
        clickDeleteStudentButton(studentId) {
            this.deleteStudentId = studentId
            this.deleteConfirmFlag = true
        },
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getTableData(this.searchKey == ''?'' : this.searchKey)
        },
        closeDialogHandle(isDisplay) {
            this.studentDialogDisplay = isDisplay
            //添加或编辑完成后需要更新table
            this.getTableData()
            this.currentEditData = {}
        },
        getTableData(searchKey = '' ){
            const requestData = {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                searchKey: this.searchKey
            }
            this.getStudentList(requestData).then(res => {
                this.totalCount = res.total
            }).catch(error => {
                console.log(error)
            })
        },
        handleSelectionChange(rows){
            this.selectedIds = rows.map(item => {
                return item.sid
            })
        },
        clickDeleteCancelButton(){
            this.deleteConfirmFlag = false
        },
        clickDeleteConfirmButton() {

            if (this.deleteStudentId > 0) {
                HttpManager.deleteStudent(this.deleteStudentId)
                    .then((res) => {
                        if (res.code == 0) {
                            this.getTableData()
                            ElMessage.success(res.msg)
                            this.deleteConfirmFlag = false
                        } else {
                            ElMessage.error(res.msg)
                        }
                    }).catch((error) => {
                    ElMessage.error('服务器错误')
                })
            } else if (this.selectedIds.length > 0) {
                HttpManager.batchDeleteStudent(this.selectedIds)
                    .then((res) => {
                        if (res.code == 0) {
                            this.getTableData()
                            ElMessage.success(res.msg)
                            this.deleteConfirmFlag = false
                        } else {
                            ElMessage.error(res.msg)
                        }
                    }).catch((error) => {
                    ElMessage.error('服务器错误')
                })
            }
        }
        },
    computed: {
        ...mapState(['studentList','personalMessageList']),
    },
}
</script>

<style scoped>
.el-select {
    width: 300px;
}
.el-input {
    width: 300px;
}
</style>
