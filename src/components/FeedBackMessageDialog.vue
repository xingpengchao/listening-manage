<template>
  <div>
    <el-dialog v-model="feedbackMessageDialogDisplay" title="查询反馈" align-center @close="feedbackMessageDialogClose">
      <el-scrollbar max-height="480px" style="padding-right: 10px" >
        <div
            v-for="(item, index) in feedbackMessageList"
            :key="index">
          <span style="display: block; font-size: 20px; margin: 20px 0px;">对话名称：{{item.cName}}</span>
          <div
              v-for="(element, index) in item.cQuestions"
              :key="index">
            <span style="display: block; margin-top: 10px">问题：{{element.question}}</span>
            <span style="display: block; margin-bottom: 5px">答题思路：</span>
            <el-input
                v-model="element.questionThought"
                :autosize="{ minRows: 3, maxRows: 3}"
                resize="none"
                type="textarea" />
            <span style="display: block; margin-bottom: 5px">提示满意度：</span>
            <el-input
                v-model="element.hintSatisfaction"
                :autosize="{ minRows: 3, maxRows: 3}"
                resize="none"
                type="textarea" />
          </div>
        </div>
      </el-scrollbar>
    </el-dialog>
  
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";

export default {
  name: "FeedbackMessageDialog",
  props:{
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
  data(){
    return {
      feedbackMessageDialogDisplay: false,
    }
  },
  watch: {
    isShowDialog: {
      handler(newValue, oldValue) {
        this.feedbackMessageDialogDisplay = newValue
      },
      deep: true
    },
    ids: {
      handler(newValue, oldValue) {
        if(Number(newValue.examinationId) > 0 &&  Number(newValue.studentId) > 0) {
          // 请求假数据
          const mockRequestData2 = {
            eId: newValue.examinationId,
            sId: newValue.studentId
          }
          this.getFeedbackMessageListByEIdAndSId(mockRequestData2)
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions(['getFeedbackMessageListByEIdAndSId']),
    feedbackMessageDialogClose(){
      this.feedbackMessageDialogDisplay = false
      this.$emit("closeFeedbackMessageDialog", this.feedbackMessageDialogDisplay)
    }
  },
  computed: {
    ...mapState(['feedbackMessageList']),
    ids() {
      const {examinationId, studentId} = this
      return {examinationId, studentId}
    }
  }
}
</script>

<style scoped>

</style>