<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="danger" @click="batchDeleteConversation">批量删除</el-button>
            <el-input placeholder="按对话名称搜索" v-model="searchKey" style="width: 200px; margin: 0 12px"></el-input>
            <el-button type="primary" @click="searchConversation">搜索</el-button>
            <el-button type="primary" @click="clickAddConversationButton">添加对话</el-button>
        </div>
        <el-table :data="currentTableData" border style="width: 100%" :cell-class-name="cellClassName" >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="cName" label="对话名称" width="100" />
            <el-table-column prop="title_text" label="对话文本简介" width="100"/>
            <el-table-column prop="cFileName" label="音频文件名" width="160" />
            <el-table-column prop="title_total" label="题目个数" width="81" />
            <el-table-column label="操作" align="center">
                <template v-slot="scope">
                    <el-button @click="clickViewConversationButton(scope.row.num,scope.row.title_num)">查看</el-button>
                    <el-button type="primary" @click="clickEditConversationButton(scope.row.num,scope.row.title_num)">编辑</el-button>
                    <el-button type="danger" @click="clickDeleteMinPaperButton(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="pagination"
                background
                layout="total, prev, pager, next"

                :current-page="currentPage"
                :page-size="pageSize"
                :total="this.conversationList.length"
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
        <ConversationFormDialog
                :is-show-dialog="conversationDialogDisplay"
                :conversation-id="currentConversationId"
                :display-type="dialogType"
                :num='num'
                :total="this.conversationList.length"
                :proxy='this.proxy'
                @closeDialog="closeDialogHandle">
        </ConversationFormDialog>
    </div>
</template>

<script>
import  { mapState, mapMutations, mapActions } from 'vuex'
import ConversationFormDialog from "@/components/ConversationFormDialog";
import {ElMessage} from "element-plus";
import {HttpManager} from "@/api";
import {CODE} from "@/resources/common";
export default {
    components: {
        ConversationFormDialog
    },
    data() {
        return {
            num:null,
            searchKey: "",
            currentPage: 1,
            pageSize: 3,
            conversationDialogDisplay: false,
            currentConversationId: null,
            dialogType: "",
            ctotal:null, // 该份试卷目前对话数
            introduce:'',
            proxy:null,
            deleteConfirmFlag: false,//删除
            //num，ctotal,introduce,proxy都是从paperview.vue传过来的
        }
    },
    created() {
//兄弟组件间传值，传过来的值会被转会为string
        this.num=parseInt(this.$route.query.num)
        this.ctotal=parseInt(this.$route.query.total)
        this.introduce=this.$route.query.introduce
        this.proxy=this.$route.query.proxy==='true'
        // 请求假数据
        if(!this.num){
            ElMessage.warning("请先选择相应的试卷~")
        }
        else {
            const mockRequestData = {
                num: this.num
            }
            this.getConversationList(mockRequestData)
        }
    },

    methods: {
        ...mapActions(['getConversationList']),
        batchDeleteConversation() {
            alert("批量删除试题")
        },
        searchConversation() {
            alert("搜索试题")
        },
        clickDeleteMinPaperButton(minPaperNum){
            this.deletePaperNum = minPaperNum.num
            this.deleteConfirmFlag = true
        },
        clickDeleteCancelButton(){
            this.deleteConfirmFlag = false
        },
        clickDeleteConfirmButton(){
            // console.log(this.deletePaperNum)
            // HttpManager.deletePaper(this.deletePaperNum)
            //     .then((res) => {
            //         if(res.code == CODE.OK_200){
            //             this.getTableData()
            //             ElMessage.success(res.msg)
            //             this.deleteConfirmFlag = false
            //         }else {
            //             ElMessage.error(res.msg)
            //         }
            //     }).catch((error) => {
            //     ElMessage.error('服务器错误')
            // })
        },
        clickAddConversationButton() {
            this.dialogType = 'add'
            console.log(this.conversationList)
            if(this.conversationList.length===0){
                this.currentConversationId=1
            }
            else {
                this.currentConversationId = this.conversationList[this.conversationList.length - 1].title_num + 1
            }
            console.log(this.currentConversationId)
            this.conversationDialogDisplay = true
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        clickViewConversationButton(num,cId) {
            this.dialogType = 'view'
            this.currentConversationId = cId
            this.num=num
            console.log(this.currentConversationId)
            this.conversationDialogDisplay = true
        },
        clickEditConversationButton(num,cId) {
            this.num=num;
            this.dialogType = 'edit'
            this.currentConversationId = cId
            this.conversationDialogDisplay = true
        },
        //row和column是表格的行和列,里面是当前行和列的值,也就是tableData里的值,rowIndex,columnIndex是当前行和列的序号
        cellClassName({row,column,rowIndex,columnIndex}) {
            return columnIndex == 2 ? 'conversation_text_cell' : ''
        },

        closeDialogHandle(isDisplay) {
            this.conversationDialogDisplay = isDisplay
            this.getConversationList({num:this.num})
        },
    },
    computed: {
        ...mapState(['conversationList']),
        currentTableData() {
            return this.conversationList?.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)

        }
    }
}
</script>

<style>
.conversation_text_cell .cell {
    /*让单元格内的换行符正常显示*/
    white-space: pre-line;
    word-break: keep-all;
    height: 110px;
    max-height: 110px;
}
.container {
    overflow-y: hidden;
}
.el-textarea__inner {
    white-space: pre-line;
    word-break: keep-all;
}
.el-textarea__inner::-webkit-scrollbar {
    width: 6px;
}
.el-textarea__inner::-webkit-scrollbar-thumb {
    background-color: #0003;
    border-radius: 10px;
}
.el-textarea__inner::-webkit-scrollbar-track {
    border-radius: 10px;
}
</style>
