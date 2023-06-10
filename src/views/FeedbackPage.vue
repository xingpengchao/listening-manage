<template>
  <div class="container">
    <div class="handle-box">
      <el-button type="primary" @click="clickSelectFeedbackButton">查询反馈</el-button>
    </div>
    <el-table :data="currentTableData" max-height="421" border style="width: 100%">
      <el-table-column prop="name" label="姓名" width="240" />
      <el-table-column prop="number" label="学号" width="240" />
      <el-table-column prop="submitTime" label="提交日期" width="240" />
      <el-table-column prop="flag" label="状态" width="69">
        <template v-slot="scope">
          <!-- "success", "info", "warning", "danger", ""-->
          <el-tag
              :type="getTagType(scope)"
              disable-transitions>{{getTagValue(scope)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button type="primary" @click="clickFeedbackDetailButton(scope.row.sId)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="pagination"
      background
      layout="total, prev, pager, next"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="this.feedbackList.length"
      @current-change="handleCurrentChange" />
    <FeedbackFormDialog
      :is-show-dialog="selectFeedbackDisplay"
      @closeDialog="closeDialogHandle"></FeedbackFormDialog>
    <FeedbackQuestionnaireDialog
      :is-show-dialog="viewFeedbackDisplay"
      :student-id="String(currentFeedbackReportId)"
      :dialog-type="questionnaireDialog"
      @closeQuestionnaireDialog="closeQuestionnaireDialogHandle"></FeedbackQuestionnaireDialog>
  </div>
</template>

<script>
import {mapState} from "vuex";
import FeedbackFormDialog from "@/components/FeedbackFormDialog";
import FeedbackQuestionnaireDialog from "@/components/FeedbackQuestionnaireDialog";
export default {
  name: "FeedbackPage",
  components: {
    FeedbackFormDialog,
    FeedbackQuestionnaireDialog
  },
  data() {
    return {
      selectFeedbackDisplay: false,
      viewFeedbackDisplay: false,
      currentFeedbackReportId: '', // 记录的是当前打开了哪一个同学提交的调查问卷
      questionnaireDialog: 'view',
      currentPage: 1,
      pageSize: 8,
    }
  },
  methods: {
    clickSelectFeedbackButton() {
      this.selectFeedbackDisplay = true
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    getTagType(scope) {
      const flag = scope.row.flag
      return flag === 1 ? 'success' : flag === 2 ? 'danger' : ''
    },
    getTagValue(scope) {
      const flag = scope.row.flag
      if (flag === 1) {
        return '已读'
      } else if (flag === 2) {
        return '未读'
      } else {
        return '未知'
      }
    },
    clickFeedbackDetailButton(sId) {
      this.currentFeedbackReportId = sId
      this.viewFeedbackDisplay = true
    },
    closeDialogHandle(isDisplay) {
      this.selectFeedbackDisplay = isDisplay
    },
    closeQuestionnaireDialogHandle(isDisplay) {
      this.viewFeedbackDisplay = isDisplay
    },
  },
  computed: {
    ...mapState(['feedbackList']),
    currentTableData() {
      return this.feedbackList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  }
}
</script>

<style>
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