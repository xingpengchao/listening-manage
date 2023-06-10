<template>
  <div class="container">
    <el-table
        :data="currentTableData"
        style="width: 100%"
        max-height="481"
        border >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="examinationName" label="考试名称" width="200" />
      <el-table-column prop="submitTime" label="交卷时间" width="200" />
      <el-table-column prop="testDuration" label="考试历时" width="200" />
      <el-table-column
          prop="examinationState"
          label="状态"
          width="81"
          filter-placement="bottom-end" >
        <template v-slot="scope">
          <!-- "success", "info", "warning", "danger", ""-->
          <el-tag
              :type="getTagType(scope)"
              disable-transitions>{{getTagValue(scope)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button @click="clickViewReportButton(scope.row.id)">查看评估报告</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="this.studentExaminationList.length"
        @current-change="handleCurrentChange" >
    </el-pagination>
    <HearingAssessmentReportDialog
      :is-show-dialog="reportDialogDisplay"
      @closeDialog="closeDialogHandle"></HearingAssessmentReportDialog>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import HearingAssessmentReportDialog from "@/components/HearingAssessmentReportDialog";

export default {
  name: "MyExaminationPage",
  components: {
    HearingAssessmentReportDialog
  },
  data() {
    return {
      reportDialogDisplay: false,
      currentPage: 1,
      pageSize: 9,
    }
  },
  created() {
    // 请求假数据
    const mockRequestData = {
      id: "examination xxx",
      name: 'examination sss'
    }
    this.getExaminationListBySId(mockRequestData)
  },
  methods: {
    ...mapActions(['getExaminationListBySId']),
    getTagType(scope) {
      const flag = scope.row.joinState
      return flag === 0 ? '' : flag === 1 ? 'success' : ''
    },
    getTagValue(scope) {
      const flag = scope.row.joinState
      if (flag === 0) {
        return '未参加'
      } else if (flag === 1) {
        return '已参加'
      } else {
        return '未知'
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    clickViewReportButton(eId) {
      this.reportDialogDisplay = true
    },
    closeDialogHandle(isDisplay) {
      this.reportDialogDisplay = isDisplay
    }
  },
  computed: {
    ...mapState(['studentExaminationList', 'user']),
    currentTableData() {
      return this.studentExaminationList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  }
}
</script>

<style scoped>

</style>