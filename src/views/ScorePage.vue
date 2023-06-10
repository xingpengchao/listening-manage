<template>
  <div class="container">
    <div style="width: 100%; margin-bottom: 20px;">
      <el-row style="width: 100%">
        <el-col :span="8">
          <el-button type="primary" @click="clickSelectExaminationButton">选择考试</el-button>
        </el-col>
        <el-col :span="8">
          <div class="center_style">
            <span class="ex_name">考试名称：{{examinationData.examinationName}}</span>
          </div>
        </el-col>
        <el-col :span="8">
          <div style="display: flex">
            <div style="margin-left: auto">
              <el-button :disabled="currentExaminationId <= 0" type="primary" @click="clickGeneralSituationButton">查看总况</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-table :data="currentTableData" max-height="420" border style="width: 100%">
      <el-table-column prop="name" label="姓名" width="130" />
      <el-table-column prop="number" label="学号" width="130" />
      <el-table-column prop="actualScore" label="实际分数" width="130" />
      <el-table-column prop="interveneScore" label="干预分数" width="130" />
      <el-table-column prop="progressScore" label="进步分数" width="130" />
      <el-table-column prop="LPS" label="LPS" width="130" />
      <el-table-column prop="interveneTimes" label="干预次数" width="130" />
<!--      <el-table-column prop="interveneLevel" label="干预等级" width="120" />-->
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button type="primary" @click="clickShowDetailButton(scope.row.sId)">查看详情</el-button>
          <el-button type="primary" @click="clickShowFeedBackMessageButton(scope.row.sId)">查看反馈</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="this.examinationScoreList.length"
        @current-change="handleCurrentChange" />
    <ScoreDetailDialog
      :is-show-dialog="scoreDetailDialogDisplay"
      :examination-id="String(currentExaminationId)"
      :student-id="String(currentStudentId)"
      @closeScoreDetailDialog="closeScoreDetailDialogHandle"></ScoreDetailDialog>
    <ScoreChartDialog
      :is-show-dialog="generalSituationDisplay"
      @closeScoreChartDialog="closeScoreChartDialogHandle"></ScoreChartDialog>
    <QueryExaminationDialog
      :is-show-dialog="scoreDialogDisplay"
      @queryScore="queryScoreHandle"
      @closeDialog="closeDialogHandle">
    </QueryExaminationDialog>
    <FeedBackMessageDialog
      :is-show-dialog="feedBackMessageDialogDisplay"
      :examination-id="String(currentExaminationId)"
      :student-id="String(currentStudentId)"
      @closeFeedbackMessageDialog="closeFeedbackMessageDialogHandle"
    ></FeedBackMessageDialog>
  </div>
</template>

<script>
  import QueryExaminationDialog from "@/components/QueryExaminationDialog";
  import ScoreDetailDialog from "@/components/ScoreDetailDialog";
  import {mapActions, mapState} from "vuex";
  import ScoreChartDialog from "@/components/ScoreChartDialog";
  import FeedBackMessageDialog from "@/components/FeedBackMessageDialog";
  export default {
    components: {
      QueryExaminationDialog,
      ScoreDetailDialog,
      ScoreChartDialog,
      FeedBackMessageDialog
    },
    data() {
      return {
        scoreDialogDisplay: false,
        scoreDetailDialogDisplay: false,
        generalSituationDisplay: false,
        currentExaminationId: 0,
        currentStudentId:0,
        currentPage: 1,
        pageSize: 8,
        feedBackMessageDialogDisplay: false,
      }
    },
    methods: {
      ...mapActions(['getExaminationScoreList', 'getExaminationById']),
      clickSelectExaminationButton() {
        this.scoreDialogDisplay = true
      },
      closeDialogHandle(isDisplay) {
        this.scoreDialogDisplay = isDisplay
      },
      queryScoreHandle(id) {
        this.currentExaminationId = id
        // 请求假数据
        const mockRequestData = {
          id: id,
        }
        this.getExaminationScoreList(mockRequestData)
        this.getExaminationById(mockRequestData)
        this.currentTableData = this.examinationScoreList
      },
      handleCurrentChange(val) {
        this.currentPage = val;
      },
      clickShowDetailButton(sId) {
        this.scoreDetailDialogDisplay = true
        this.currentStudentId = sId
      },
      clickGeneralSituationButton() {
        this.generalSituationDisplay = true
      },
      closeScoreDetailDialogHandle(isDisplay) {
        this.scoreDetailDialogDisplay = isDisplay
      },
      closeScoreChartDialogHandle(isDisplay) {
        this.generalSituationDisplay = isDisplay
      },
      clickShowFeedBackMessageButton(sId){
        this.feedBackMessageDialogDisplay = true
        this.currentStudentId = sId
      },
      closeFeedbackMessageDialogHandle(isDisplay){
        this.feedBackMessageDialogDisplay = isDisplay
      }
    },
    computed: {
      ...mapState(['examinationScoreList', 'examinationData']),
      currentTableData() {
        return this.examinationScoreList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      },

    }
  }
</script>

<style>

.ex_name {
  font-size: 25px;
  font-style: normal;
  opacity: 0.8;
}

.score_detail_dialog .el-dialog__body {
  padding-top: 3px;
}

.center_style {
  /*下面三行代码的作用是让一个div中的元素上下左右居中*/
  display:flex;
  justify-content:center;
  align-items:center;
}

</style>