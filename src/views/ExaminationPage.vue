<template>
    <div class="container">
        <div class="handle-box">
            <el-button type="danger" @click="batchDeleteExamination">批量删除</el-button>
            <el-input placeholder="按考试名称搜索" v-model="searchKey" style="width: 200px; margin: 0 12px"></el-input>
            <el-button type="primary" @click="searchExamination">搜索</el-button>
            <el-button type="primary" @click="clickAddExaminationButton">添加考试</el-button>
        </div>
        <el-table
                :data="currentTableData"
                style="width: 100%"
                max-height="421"
                border >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="试卷名称" width="150" />
            <el-table-column prop="startTime" label="开始时间" width="170" >
<!--                <template v-slot="scope">-->
<!--                    {{ formatDate(scope.row.startTime) }}-->
<!--                </template>-->
            </el-table-column>
            <el-table-column prop="finishTime" label="结束时间" width="170" />
            <el-table-column
                    prop="examinationState"
                    label="状态"
                    width="81"
                    :filters="[{ text: '未开始', value: 0 }, { text: '进行中', value: 1 }, { text: '已结束', value: 2 }]"
                    :filter-method="filterTag"
                    filter-placement="bottom-end" >
                <template v-slot="scope">
                    <!-- "success", "info", "warning", "danger", ""-->
                    <el-tag
                            :type="getTagType(scope)"
                            disable-transitions>{{getTagValue(scope)}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="classNames" label="考试班级" width="170" />
            <el-table-column label="操作" align="center" width="400">
                <template v-slot="scope">
                    <!--          <el-button @click="clickViewPaperButton(scope.row.id)">查看</el-button>-->
                    <el-button type="warning" @click="clickEditPaperButton(scope.row.id)">编辑</el-button>
                    <span v-if="scope.row.examinationState != 2" style="margin: 0 12px">
            <el-button type="primary" :disabled="scope.row.examinationState == 1 ? true : false" @click="" >开始</el-button>
            <el-button type="primary" :disabled="scope.row.examinationState != 1 ? true : false" @click="" >结束</el-button>
          </span>
                    <el-button type="danger" @click="">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                class="pagination"
                background
                layout="total, prev, pager, next"
                :current-page="currentPage"
                :page-size="pageSize"
                :total="this.testPaperList.length"
                @current-change="handleCurrentChange" >
        </el-pagination>
        <ExaminationDialog
                :examination-id="currentExaminationId"
                :is-show-dialog="this.examinationDialogDisplay"
                :dialog-title="dialogTitle"
                :papers="papers"
                :classes="classes"
                @confirm="addExam"
                @closeDialog="closeDialogHandle">
        </ExaminationDialog>
    </div>
</template>

<script>
import  { mapState, mapMutations, mapActions } from 'vuex'
import ExaminationDialog from "@/components/ExaminationDialog";
import {HttpManager} from "@/api";
import {CODE} from "@/resources/common";
import {ElMessage} from "element-plus";
export default {
    components: {
        ExaminationDialog
    },
    data() {
        return {
            searchKey: "",
            currentPage: 1,
            pageSize: 8,
            dialogTitle: "",
            examinationDialogDisplay: false,//添加考试对话框显隐状态
            papers:[],//所有已经创建好的试卷
            classes: [],  //所有已经创建好的班级
            currentExaminationId: null,
        }
    },
    created() {
        // 请求假数据
        this.getData()
        console.log('68')
        // this.getExaminationList()
        this.getPaperList({
            currentPage: this.currentPage,
            pageSize: this.pageSize,
        })
        this.getClassList(
            {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
            }
        )
        this.getTableData()
        console.log(this.testPaperList)
    },
    methods: {
        ...mapActions(['getExaminationList','getPaperList','getClassList','getTestPaperList']),
        getTableData() {
            this.getTestPaperList()
                .then(res => {
                    this.totalCount = res.total
                    console.log(res.hashmap.testingPaperView)
                    console.log('688')
                }).catch(error => {
                console.log(error)
            })
        },
        //添加考试时，获取当前时间+60秒
        getData(){
            const now = new Date();
            const formattedTime = `${now.getMonth() + 1} ${now.getDate()} ${now.getHours()} ${now.getMinutes()} ${now.getSeconds()}`;
            // console.log(formattedTime);
            return formattedTime;
        },
        formatDate(str){
            // 将输入的字符串按照空格分割为数组
            const arr = str.split(' ')

            // 获取年、月、日、时、分、秒信息
            // const year = date.getFullYear();
            const month = Number(arr[0]);
            const day = Number(arr[1]);
            const hour = Number(arr[2]);
            const minute = Number(arr[3]);
            const second = Number(arr[4]);

            // 拼接成目标格式的字符串
            // return `${month}月${day}日${hour < 10 ? '0' + hour : hour}点${minute < 10 ? '0' + minute : minute}分${second < 10 ? '0' + second : second}秒`;
            return `${month}月${day}日${hour < 10 ? '0' + hour : hour}点${minute < 10 ? '0' + minute : minute}分`;

        },
        addExam({minute,selectedPaper,selectedClass}){
            const params = {
                time: this.getData(),
                Minute: minute,
                classNames:selectedClass.className,
                num:selectedPaper.num,
                name:selectedPaper.name,
                total: selectedPaper.total,
                introduce: selectedPaper.introduce,
                isProxy: selectedPaper.proxy
            };
            this.examinationDialogDisplay = false
            //处理添加考试逻辑
            console.log(params)
            HttpManager.addTestPaper(params)
                .then((res) => {
                    if(res.code == CODE.OK_200){
                         this.getTableData()
                        console.log('523横杠')
                        ElMessage.success(res.msg)
                        this.deleteConfirmFlag = false
                    }else {
                        ElMessage.error(res.msg)
                    }
                }).catch((error) => {
                ElMessage.error('服务器错误')
            })


        },
        batchDeleteExamination() {
            alert("批量删除考试")
        },
        searchExamination() {
            alert("搜索考试")
        },
        clickAddExaminationButton() {
            console.log(this.papers)
            console.log(this.classes)

            this.dialogTitle = "添加考试"
            this.examinationDialogDisplay = true
        },
        filterTag(value, row) {
            return value === row.examinationState
        },
        getTagType(scope) {
            const flag = scope.row.examinationState
            return flag === 1 ? 'success' : flag === 2 ? 'danger' : ''
        },
        getTagValue(scope) {
            const flag = scope.row.examinationState
            if (flag === 0) {
                return '未开始'
            } else if (flag === 1) {
                return '进行中'
            } else if(flag === 2) {
                return '已结束'
            } else {
                return '未知'
            }
        },
        handleCurrentChange(val) {
            this.currentPage = val;
        },
        closeDialogHandle(isDisplay) {
            this.examinationDialogDisplay = isDisplay
        },
        clickViewPaperButton(id) {
            this.currentExaminationId = id
            console.log(id)
            this.dialogTitle = "考试详情"
            this.examinationDialogDisplay = true
        },
        clickEditPaperButton(id){
            this.$router.push({path:'/question',query:{num:id}})
            console.log(id)
        }
    },
    computed: {
        ...mapState(['examinationList','paperList', 'classList','testPaperList']),
        currentTableData() {
            console.log(this.paperList)
            console.log(this.classList)
            this.papers = this.paperList
            this.classes = this.classList
            // console.log(this.examinationList)
            return this.testPaperList?.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
        },
    }
}
</script>

<style>
</style>
