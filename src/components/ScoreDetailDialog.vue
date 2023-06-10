<template>
  <div>
    <el-dialog
        class="score_detail_dialog"
        v-model="scoreDetailDialogDisplay"
        title="查看详情" width="760"
        align-center
        @close="scoreDetailDialogClose">
      <span style="display: block; margin-bottom: 5px">姓名：{{studentData.name}}</span>
      <span style="display: block; margin-bottom: 5px">学号：{{studentData.number}}</span>
      <span style="display: block; margin-bottom: 5px">测试历时时长：{{testDuration + 'ms'}}</span>
      <el-table :data="scoreDetail" max-height="400" border style="width: 100%">
        <el-table-column prop="qId" label="题号" width="120" />
        <el-table-column prop="actualScore" label="实际分数" width="120" />
        <el-table-column prop="interveneScore" label="干预分数" width="120" />
        <el-table-column prop="interveneTimes" label="干预次数" width="120" />
        <el-table-column prop="testTime" label="测试时长" width="120" />
        <el-table-column prop="answerTime" label="答题时长" width="120" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import  { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: "ScoreDetailDialog",
  props: {
    isShowDialog: {
      type: Boolean,
      default: false
    },
    examinationId: {
      type: String,
      default: ''
    },
    studentId: {
      type: String,
      default: ''
    }
  },
  watch: {
    isShowDialog: {
      handler(newValue, oldValue) {
        this.scoreDetailDialogDisplay = newValue
      },
      deep: true
    },
    ids: {
      handler(newValue, oldValue) {
        if(Number(newValue.examinationId) > 0 &&  Number(newValue.studentId) > 0) {
          // 请求假数据
          const mockRequestData = {
            id: newValue.studentId,
          }
          this.getStudentById(mockRequestData)
          console.log(this.studentData)
          const mockRequestData2 = {
            eId: newValue.examinationId,
            sId: newValue.studentId
          }
          this.getScoreDetailByEIdAndSId(mockRequestData2)
        }
      },
      deep: true
    }
  },
  data() {
    return {
      scoreDetailDialogDisplay: false,
    }
  },
  methods: {
    ...mapActions(['getStudentById', 'getScoreDetailByEIdAndSId']),
    scoreDetailDialogClose() {
      this.scoreDetailDialogDisplay = false
      this.$emit("closeScoreDetailDialog", this.scoreDetailDialogDisplay)
    },
  },
  computed: {
    ...mapState(['studentData', 'scoreDetail']),
    testDuration() {
      const sum = this.scoreDetail.reduce(
          (previousValue, currentValue) => {
            const endIndex =  currentValue.answerTime.indexOf('ms')
            const subStr = currentValue.answerTime.slice(0, endIndex)
            return previousValue + Number(subStr)
          },
          0
      )
      return sum
    },
    ids() {
      const {examinationId, studentId} = this
      return {examinationId, studentId}
    }
  }
}
</script>

<style scoped>

</style>