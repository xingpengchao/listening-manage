<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="danger" @click="batchDeletePaper">批量删除</el-button>
            <el-input placeholder="按考试名称搜索" v-model="searchKey" style="width: 200px; margin: 0 12px"></el-input>
            <el-button type="primary" @click="searchPaper">搜索</el-button>
            <el-button type="primary" @click="clickAddPaperButton">添加试卷</el-button>
        </div>
        <el-table
                :data="currentTableData"
                style="width: 100%"
                max-height="421"
                border >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="试卷名称" width="200"/>
            <el-table-column prop="introduce" label="介绍"  width="200"></el-table-column>
                <el-table-column
                    prop="proxy"
                    label="状态"
                    width="81"
                    :filters="[{ text: '非加强测', value: false }, { text: '加强测', value: true }]"
                    :filter-method="filterTag"
                    filter-placement="bottom-end" >
                <template v-slot="scope">
                    <!-- "success", "info", "warning", "danger", ""-->
                    <el-tag
                        :type="getTagType(scope)"
                        disable-transitions>{{getTagValue(scope)}}</el-tag>
                </template>
                    </el-table-column>
                    <el-table-column prop="total" label="大题数" width="90"/>
                    <el-table-column label="操作" align="center" width="300">
                <template v-slot="scope">
<!--                    <el-button @click="clickViewPaperButton(scope.row.num,scope.row.name,scope.row.introduce,scope.row.total,scope.row.proxy)">查看</el-button>-->
                    <el-button type="warning" @click="clickEditPaperButton(scope.row.num,scope.row.name,scope.row.introduce,scope.row.proxy,scope.row.total)">编辑</el-button>
                    <el-button type="danger" @click="clickDeletePaperButton(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="pagination"
                background
                layout="total, prev, pager, next"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="this.paperList.length"
                @current-change="handleCurrentChange" >
        </el-pagination>
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
        <PaperViewDialog
            :paperName="this.currentPaperName"
            :paperId="this.currentPaperId"
            :paperIntroduce="this.currentPaperIntroduce"
            :paperProxy="this.currentPaperProxy"
            :paperTotal="this.currentPaperTotal"
            :is-show-dialog="this.PaperViewDialogDisplay"
            :dialog-title="this.dialogTitle"
            :introduce:="this.currentPaperIntroduce"
            :proxy:="this.currentPaperProxy"
            @closeDialog="closeDialogHandle">
        </PaperViewDialog>
    </div>
</template>

<script>
import  { mapState, mapMutations, mapActions } from 'vuex'
import PaperViewDialog from "@/components/PaperViewDialog";
import {HttpManager} from "@/api";
import {CODE} from "@/resources/common";
import {ElMessage} from "element-plus";
export default {
    components: {
       PaperViewDialog
    },
    data() {
        return {
            searchKey: "",
            currentPage: 1,
            pageSize: 8,
            dialogTitle: "",
           PaperViewDialogDisplay: false,
            currentPaperId: null,
            currentPaperName:'',
            currentPaperIntroduce:'',
            currentPaperProxy:null,
            currentPaperTotal:null,
            deletePaperNum: 0,
            deleteConfirmFlag: false,//删除
        }
    },
    created() {
        // 请求假数据
        this.getPaperList()
    },
    methods: {
        ...mapActions(['getPaperList','getPaperList']),
        batchDeletePaper() {
            alert("批量删除考试")
        },
        searchPaper() {
            alert("搜索考试")
        },
        clickAddPaperButton() {
            this.currentPaperId = this.paperList[this.paperList.length-1].num+1
            console.log(this.currentPaperId)
            this.dialogTitle = "添加试卷"
            this.PaperViewDialogDisplay = true
            console.log("test")
        },
        clickDeletePaperButton(paperNum){
            this.deletePaperNum = paperNum.num
            this.deleteConfirmFlag = true
        },
        clickDeleteCancelButton(){
            this.deleteConfirmFlag = false
        },
        clickDeleteConfirmButton(){
            console.log(this.deletePaperNum)
            HttpManager.deletePaper({paperNum:this.deletePaperNum})
                .then((res) => {
                    if(res.code == CODE.OK_200){
                        this.getPaperList()
                        ElMessage.success(res.msg)
                        this.deleteConfirmFlag = false
                    }else {
                        ElMessage.error(res.msg)
                    }
                }).catch((error) => {
                    console.log(error)
                ElMessage.error('服务器错误')
            })
        },
        filterTag(value, row) {
            return value === row.proxy
        },
        getTagType(scope) {
            const flag = scope.row.proxy
            return flag === true ? 'success' : flag === false ? 'warning' : ''
        },
        getTagValue(scope) {
            const flag = scope.row.proxy
            if (flag === true) {
                return '加强测'
            } else if (flag ===false ) {
                return '非加强测'

            } else {
                return '未知'
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        closeDialogHandle(isDisplay) {
            this.PaperViewDialogDisplay = isDisplay
            this.getPaperList()
        },
        clickViewPaperButton(id,name,introduce,total,proxy) {
            this.currentPaperId = id
            this.currentPaperName=name
            this.currentPaperIntroduce=introduce
            this.currentPaperProxy=proxy
            this.currentPaperTotal=total
            this.PaperViewDialogDisplay = true

        },
        clickEditPaperButton(id,name,introduce,proxy,total){
            console.log(id,name,introduce,proxy,total)
            this.$router.push({
                path:'/question',
                query: {
                    num:id,
                    name:name,
                    introduce:introduce,
                    proxy:proxy,
                    total:total
                }
            })
        }
    },
    computed: {
        ...mapState(['paperList']),
        currentTableData() {
            return this.paperList?.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        }
    }
}
</script>

<style>
</style>
