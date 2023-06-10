<template>
  <div>
    <el-dialog
      v-model="feedbackDisplay"
      title="调查问卷"
      align-center
      destroy-on-close
      @close="feedbackQuestionnaireDialogClose">
      <el-scrollbar max-height="480px" style="padding-right: 10px" >
        <el-form
            :model="answerForm"
            label-position="top"
            label-width="82px"
            :disabled="dialogType == 'view'">
          <el-form-item
              v-if="dialogType == 'view'"
              v-for="(item, index) in feedbackReportData"
              :key="item.fqId"
              :label="(index + 1) + '. ' + item.fQuestion">
            <el-radio-group
                v-model="item.answer"
                style="display: flex; flex-flow: column nowrap; align-items: flex-start">
              <el-radio label="1">非常符合</el-radio>
              <el-radio label="2">比较符合</el-radio>
              <el-radio label="3">难以判断</el-radio>
              <el-radio label="4">不太符合</el-radio>
              <el-radio label="5">非常不符合</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
              v-else
              v-for="(item, index) in fQuestionList"
              :key="item.fqId"
              :label="(index + 1) + '. ' + item.fQuestion">
            <el-radio-group
                v-model="answerForm[item.fqId]"
                style="display: flex; flex-flow: column nowrap; align-items: flex-start">
              <el-radio label="1">非常符合</el-radio>
              <el-radio label="2">比较符合</el-radio>
              <el-radio label="3">难以判断</el-radio>
              <el-radio label="4">不太符合</el-radio>
              <el-radio label="5">非常不符合</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-button v-if="dialogType == 'add'" type="primary" @click="clickSubmitQuestionnaireButton">提交</el-button>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import  { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: "FeedbackQuestionnaireDialog",
  props: {
    isShowDialog: {
      type: Boolean,
      default: false
    },
    studentId: {
      type: String,
      default: ''
    },
    dialogType: {
      type: String,
      default: 'add'
    }
  },
  watch: {
    isShowDialog: {
      handler(newValue, oldValue) {
        this.feedbackDisplay = newValue
      },
      deep: true
    },
    studentId: {
      handler(newValue, oldValue) {
        if (newValue) {
          // 请求假数据
          const mockRequestData = {
            sId: this.studentId,
          }
          if (this.dialogType == 'view') {
            this.getFeedbackReportDataBySId(mockRequestData)
          } else if (this.dialogType == 'add') {
            this.getFQuestionList()
            for (let i = 0; i < this.fQuestionList.length; i++) {
              const obj = {}
              obj[this.fQuestionList[i].fqId] = ''
              Object.assign(this.answerForm, obj)
            }
          }
        }
      },
      deep: true
    }
  },
  data() {
    return {
      feedbackDisplay: false,
      answerForm: {}
    }
  },
  methods: {
    ...mapActions(['getFeedbackReportDataBySId', 'getFQuestionList']),
    feedbackQuestionnaireDialogClose() {
      this.feedbackDisplay = false
      this.$emit("closeQuestionnaireDialog", this.feedbackDisplay)
    },
    clickSubmitQuestionnaireButton() {
      console.log(this.answerForm)
      this.feedbackDisplay = false
      this.$emit("closeQuestionnaireDialog", this.feedbackDisplay)
      this.$emit("submitQuestionnaireDialog", this.answerForm)
    }
  },
  computed: {
    ...mapState(['feedbackReportData', 'fQuestionList']),
  }
}
</script>

<style scoped>

</style>