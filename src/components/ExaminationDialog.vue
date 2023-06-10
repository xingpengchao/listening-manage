<template>
  <div>
    <el-dialog v-model="examinationDialogDisplay" :title="dialogTitle" align-center @close="examinationDialogClose">
      <div style="height: 440px">
        <el-scrollbar max-height="440px" style="padding-right: 10px" >
          <el-form
              :model="formData"
              label-position="left"
              label-width="82px"
              :disabled="Boolean(examinationId)"
              style="width: 100%">
            <el-form-item label="考试时长">
              <el-input v-model="minute" />
            </el-form-item>

            <el-form-item label="试卷">
                <el-select
                        v-model="selectedPaper"
                        value-key="num"
                        placeholder="请选择试卷">
                    <el-option
                            v-for="paper in papers"
                            :value="paper"
                            :key="paper.num"
                            :label="paper.name">
                    </el-option>
                </el-select>
            </el-form-item>

              <el-form-item label="班级">
                  <el-select
                          v-model="selectedClass"
                          value-key="classId"
                          placeholder="请选择班级">
                      <el-option
                              v-for="className in classes"
                              :value="className"
                              :label="className.className"
                              :key="className.classId">
                      </el-option>
                  </el-select>
              </el-form-item>

          </el-form>

        </el-scrollbar>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="clickCancelButton">Cancel</el-button>
          <el-button type="primary" @click="clickConfirmButton">Confirm</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  import  { mapState, mapMutations, mapActions } from 'vuex'
  import { ElMessage } from 'element-plus'
  import {HttpManager} from "@/api";
  import {CODE} from "@/resources/common";
  export default {
    props: {
      isShowDialog: {
        type: Boolean,
        default: false
      },
      dialogTitle: {
        type: String,
        default: ''
      },
      papers: {// 所有试卷的列表，用于显示下拉框选择项
          type: Array,
          default: () => []
      },
        classes: { // 所有班级的列表，用于显示下拉框选择项
            type: Array,
            default: () => []
        }
    },
    watch: {
      isShowDialog: {
        handler(newValue, oldValue) {
          this.examinationDialogDisplay = newValue
        },
        deep: true
      },
      examinationId: {
        handler(newValue, oldValue) {
            if(newValue){
               } else if (!newValue) {
            this.selectedPaper = null
            this.selectedClass = null
          }
        },
        deep: true
      }
    },
    data() {
      return {
        examinationDialogDisplay: false,
        paperDialogDisplay: false,
        // 当前画面选择对话下拉框数据
        selectedPaper: {},
        selectedClass: null,
          minute:'',
      }
    },
    methods: {
      ...mapActions(['getConversationList', 'getPaperList', 'getConversationByCIds', 'getExaminationById']),
      radioChange() {
        if (this.examinationForm.createFlag && this.examinationForm.createFlag == 2) {
          this.examinationForm.cList = []
          this.examinationForm.pName = ''
        } else {
          this.examinationForm.pId = ''
          this.examinationForm.cList = [{ cId: '', cLength: 0}]
        }
      },
      paperTypesChange() {
        console.log(this.examinationForm.pTypes)
      },

      selectPaperChange(pId) {
        if(pId) {
          const paperObj = this.paperList.find(element => element.pId == pId)
          console.log(paperObj)
          const conversationIds = JSON.parse(paperObj.cIds)
          this.examinationForm.cList = conversationIds.map((cId) => {
            const conversationObj = this.conversationList.find(element => element.cId == cId)
            if(conversationObj && conversationObj.cId) {
              return {
                cId: conversationObj.cId,
                cName: conversationObj.cName,
                cLength: conversationObj.cQuestions.length
              }
            }
          })
          console.log(this.examinationForm.cList)
        }
      },
      getSummaries(param) {
        const { columns, data } = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '试题总计'
            return
          }
          const values = data.map((item) => Number(item[column.property]))
          if (!values.every((value) => Number.isNaN(value))) {
            sums[index] = `${values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!Number.isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)}`
          } else {
            sums[index] = ''
          }
        })
        return sums
      },
      selectConversationChange(formIndex, cId) {
        const conversation = this.conversationData.find(element => element.cId == cId)
        this.examinationForm.cList[formIndex].cLength = conversation.cLength
      },
      clickAddConversationButton() {
        this.examinationForm.cList.push({ cId: '', cName: '', cLength: 0 })
      },
      clickDeleteConversationButton(formIndex) {
        this.examinationForm.cList.splice(formIndex, 1)
      },
      clickCancelButton() {
        this.examinationDialogDisplay = false
        this.$emit("closeDialog", this.examinationDialogDisplay)
      },
      clickConfirmButton() {
          this.examinationDialogDisplay = false
          console.log(this.selectedPaper)
          console.log(this.selectedClass)
          this.$emit("confirm", {minute:this.minute,selectedPaper:this.selectedPaper, selectedClass:this.selectedClass })

      },
      examinationDialogClose() {
        this.examinationDialogDisplay = false
        this.$emit("closeDialog", this.examinationDialogDisplay)
      },
        selectedPaperchange(paper){
          this.selectedPaper=paper
        },
      clickPreviewPaperButton() {
        const cIds = this.examinationForm.cList
            .filter((element) => (element.cId))
            .map((element) => { return element.cId})
        console.log(cIds)
        this.getConversationByCIds(cIds)
            .then((data) => {
              this.previewPaperDate = data
              this.paperDialogDisplay = true
        }).catch((error) => {
          ElMessage({
            message: error,
            type: 'warning',
            duration: 2000
          })
        })
      },
      getExaminationData(id) {
        const mockRequestData = {
          id: id,
        }
        this.getExaminationById(mockRequestData)
        this.selectPaperChange(this.examinationData.pId)
        const time = [new Date(this.examinationData.startTime), new Date(this.examinationData.endTime)]
        this.examinationForm.eName = this.examinationData.examinationName
        this.examinationForm.time = time
        this.examinationForm.createFlag = '2'
        this.examinationForm.pId = this.examinationData.pId
      }
    },
    computed: {
      ...mapState(['conversationList', 'paperList', 'examinationData']),
    }
  }
</script>

<style>
.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-card__body {
  padding-top: 7px;
  padding-right: 10px;
  padding-bottom: 7px;
}
.el-card__header {
  padding: 10px 10px;
}
.inner-dialog {
  margin-top: 5px;
  margin-bottom: auto;
}
.inner-dialog .el-dialog__body {
  padding: 10px 20px;
}
.paper_style p {
  margin: 3px 0px;
  white-space: pre-line;
  word-break: keep-all;
}
.question-style {
  margin-top: 17px;
  margin-bottom: 17px;
}
</style>