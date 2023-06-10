<template>
  <div>
    <el-dialog v-model="selectFeedbackDisplay" title="查询反馈" align-center @close="feedbackFormDialogClose">
      <div style="height: 250px">
        <el-form
            :model="queryFeedbackForm"
            label-position="left"
            label-width="110px">
          <el-form-item label="姓名关键字">
            <el-input v-model="queryFeedbackForm.sName" placeholder="按照学生姓名搜索"/>
          </el-form-item>
          <el-form-item label="学号关键字">
            <el-input v-model="queryFeedbackForm.number" placeholder="按照学生学号搜索"/>
          </el-form-item>
          <el-form-item label="选择提交日期">
            <el-date-picker
                v-model="queryFeedbackForm.submitTime"
                type="datetimerange"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"/>
          </el-form-item>
          <el-form-item label="选择报告的状态">
            <el-select
                v-model="queryFeedbackForm.flag"
                class="m-2"
                placeholder="选择报告的状态"
                style="width: 100%">
              <el-option
                  v-for="(item, index) in options"
                  :key="index"
                  :label="item.label"
                  :value="item.value"/>
            </el-select>
          </el-form-item>
          <span class="dialog-footer">
              <el-button style="width: 49%" type="primary" @click="clickQueryAllFeedbackButton">查询所有</el-button>
              <el-button style="width: 49%" type="primary" @click="clickQueryByConditionFeedbackButton">按输入条件查询</el-button>
            </span>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import  { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: "FeedbackFormDialog",
  props: {
    isShowDialog: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isShowDialog: {
      handler(newValue, oldValue) {
        this.selectFeedbackDisplay = newValue
      },
      deep: true
    },
  },
  data() {
    return {
      selectFeedbackDisplay: false,
      queryFeedbackForm: {
        sName: '',
        number: '',
        submitTime: '',
        flag: ''
      },
      options: [
        {
          value: 0,
          label: ' ',
        },
        {
          value: 1,
          label: '已读',
        },
        {
          value: 2,
          label: '未读',
        }
      ],
    }
  },
  methods: {
    ...mapActions(['getFeedbackList']),
    clickQueryAllFeedbackButton() {
      // 请求假数据
      const mockRequestData = {
        id: "feedbackxxx",
        name: 'feedbacksss'
      }
      this.getFeedbackList(mockRequestData)
      this.selectFeedbackDisplay = false
      this.$emit("closeDialog", this.selectFeedbackDisplay)
    },
    clickQueryByConditionFeedbackButton() {
      this.viewFeedbackDisplay = true
    },
    feedbackFormDialogClose() {
      this.selectFeedbackDisplay = false
      this.$emit("closeDialog", this.selectFeedbackDisplay)
    },
  }

}
</script>

<style scoped>

</style>