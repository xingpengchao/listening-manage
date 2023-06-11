<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="danger" @click="batchDeleteClass">批量删除</el-button>
            <el-input placeholder="按班级名进行关键字搜索" v-model="searchKey" style="width: 200px; margin: 0 12px"></el-input>
            <el-button type="primary" @click="searchClass">搜索</el-button>
            <el-button type="primary" @click="clickAddClassButton">添加班级</el-button>
        </div>
        <el-table :data="currentTableData" max-height="421" border style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="className" label="班级" width="300" />
            <el-table-column label="操作" align="center" width="300">
                <template v-slot="scope">
                    <el-button type="primary" @click="clickEditClassButton(scope.row)">编辑</el-button>
                    <el-button type="primary" prop="currentEditData" @click="clickChangeClassButton(scope.row)">修改班级名</el-button>
                    <el-button type="danger" @click="clickDeleteClassButton(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ClassFormDialog
                :is-show-dialog="classDialogDisplay"
                :dialog-flag="dialogFlag"
                :student-data="currentEditData"
                :class-name="className"
                @closeDialog="closeDialogHandle">
        </ClassFormDialog>
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
        <el-pagination
                class="pagination"
                background
                layout="total, prev, pager, next"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="this.classList.length"
                @current-change="handleCurrentChange" >
        </el-pagination>
    </div>
</template>

<script>
import  { mapState, mapMutations, mapActions } from 'vuex'
import ClassFormDialog from "@/components/ClassFormDialog";
import {HttpManager} from "@/api/index";
import {ElMessage} from "element-plus";
import {CODE} from "@/resources/common";
export default {
    components: {
        ClassFormDialog,
    },
    data: () => {
        return {
            totalCount: 0,
            searchKey: '',
            deleteConfirmFlag: false,//删除
            formLabelWidth: "140px",
            currentPage: 1,
            pageSize: 6,
            dialogFlag: "add",
            currentEditData: {} ,// 当前编辑的是哪一个班级对象
            deleteClassId: 0,
            selectedIds: [],
            classDialogDisplay: false,
            className: '',
            changeClassId:0,
        }
    },
    created() {
        console.log("513")
        this.getTableData()
    },
    methods: {
        ...mapActions(['getClassList']),
        searchClass() {
            this.getTableData(this.searchKey)
        },
        clickAddClassButton() {
            this.classDialogDisplay = true
            this.dialogFlag = "add"
        },
        clickEditClassButton(className) {
            // console.log(className.classId+"123456")
            this.className = className.className
            // console.log(this.className )
            this.$router.push({path:"/class/student",query:{className:this.className}});//跳转并传参
        },
        clickDeleteClassButton(classId) {
            console.log(classId)
            this.deleteClassId = classId
            this.deleteConfirmFlag = true
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        closeDialogHandle(isDisplay) {
            this.classDialogDisplay = isDisplay
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
            this.getClassList(requestData)
                .then(res => {
                this.totalCount = res.total
            }).catch(error => {
                console.log(error)
            })
        },
        handleSelectionChange(rows){
            this.selectedIds = rows.map(item => {
                console.log(item.sid)
                console.log("id")
                return item.sid
            })
        },
        clickDeleteCancelButton(){
            this.deleteConfirmFlag = false
        },
        clickChangeClassButton(className){
          //修改班级名称
            this.currentEditData = className
            // console.log(this.currentEditData.classId+'修改班级ID')
            // console.log(this.currentEditData.className+'修改班级名称')
            this.classDialogDisplay = true
            this.dialogFlag = "edit"
            // console.log("edit")
        },
        clickDeleteConfirmButton(){
           console.log(this.deleteClassId)
                HttpManager.deleteStudentClass(this.deleteClassId)
                    .then((res) => {
                        if(res.code == CODE.OK_200){
                            this.getTableData()
                            ElMessage.success(res.msg)
                            this.deleteConfirmFlag = false
                        }else {
                            ElMessage.error(res.msg)
                        }
                    }).catch((error) => {
                    ElMessage.error('服务器错误')
                })
            }

    },
    computed: {
        // ...mapState(['studentList','personalMessageList']),
        ...mapState(['classList']),
        currentTableData() {
            console.log(this.classList)
            return this.classList?.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        }
    }
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
