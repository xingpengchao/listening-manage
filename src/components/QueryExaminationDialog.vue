<template>
  <div>
    <el-dialog v-model="scoreDialogDisplay" title="选择考试" align-center @close="scoreDialogClose">
      <div style="height: 500px">
        <el-form
            :model="queryExaminationForm"
            label-position="left"
            label-width="110px">
          <el-form-item label="考试名称关键字">
            <el-input v-model="queryExaminationForm.eName" />
          </el-form-item>
          <el-form-item label="选择时间范围">
            <el-date-picker
                v-model="queryExaminationForm.time"
                type="datetimerange"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"/>
          </el-form-item>
          <span class="dialog-footer">
              <el-button style="width: 49%" type="primary" @click="clickQueryAllExaminationButton">查询所有</el-button>
              <el-button style="width: 49%" type="primary" @click="clickQueryByConditionExaminationButton">按输入条件查询</el-button>
            </span>
        </el-form>
        <el-table
            id="examination_table"
            :data="currentTableData"
            style="width: 100%; margin-top: 10px"
            max-height="380"
            border>
          <el-table-column :resizable="false" fixed prop="examinationName" label="考试名称" :width="dynamicWidth" />
          <el-table-column :resizable="false" prop="startTime" label="开始时间" width="165"/>
          <el-table-column :resizable="false" prop="endTime" label="结束时间" width="165"/>
          <el-table-column :resizable="false" fixed="right" label="操作" align="center" :width="dynamicWidth">
            <template v-slot="scope">
              <el-button type="primary" @click="clickViewScoreButton(scope.row.id)">查看成绩</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapActions, mapState} from "vuex";
  export default {
    props: {
      isShowDialog: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      isShowDialog: {
        handler(newValue, oldValue) {
          this.scoreDialogDisplay = newValue
        },
        deep: true
      }
    },
    data() {
      return {
        scoreDialogDisplay: false,
        queryExaminationForm: {
          eName: '',
          time: ''
        },
        currentTableData: []
      }
    },
    methods: {
      ...mapActions(['getExaminationList']),
      scoreDialogClose() {
        this.currentTableData = []
        this.queryExaminationForm.eName = ''
        this.queryExaminationForm.time = ''
        this.scoreDialogDisplay = false
        this.$emit("closeDialog", this.scoreDialogDisplay)
      },
      clickQueryAllExaminationButton() {
        // 请求假数据
        const mockRequestData = {
          id: "examination xxx",
          name: 'examination sss'
        }
        this.getExaminationList(mockRequestData)
        this.currentTableData = this.examinationList
      },
      clickQueryByConditionExaminationButton() {
        // 请求假数据
        const mockRequestData = {
          id: "examination xxx",
          name: 'examination sss'
        }
        this.getExaminationList(mockRequestData)
        const condition = this.queryExaminationForm.eName
        if (condition) {
          this.currentTableData = this.examinationList.filter(item => item.examinationName.includes(condition))
        } else {
          this.currentTableData = this.examinationList
        }
      },
      clickViewScoreButton(id) {
        this.scoreDialogDisplay = false
        this.$emit("closeDialog", this.scoreDialogDisplay)
        this.$emit("queryScore", id)
      }
    },
    computed: {
      ...mapState(['examinationList']),
      dynamicWidth() {
        this.$nextTick(() => {
          const ctx = document.getElementById('examination_table');
          return (ctx.clientWidth - 330) / 2
        })
      }
    }
  }
</script>
00000
<style scoped>

</style>