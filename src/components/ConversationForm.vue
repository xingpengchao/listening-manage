<template>
  <div style="height: 440px">
    <el-scrollbar max-height="440px" style="padding-right: 10px" >
      <el-form :model="conversationForm" label-position="left" label-width="82px" :disabled="displayType=='view'">
        <el-form-item label="对话名称">
          <el-input v-model="conversationForm.cName" />
        </el-form-item>
        <el-form-item label="文本内容">
          <el-input
              v-model="conversationForm.cText"
              :autosize="{ minRows: 10, maxRows: 10}"
              resize="none"
              type="textarea" />
        </el-form-item>
        <el-form-item label="音频文件名">
          <el-input v-model="conversationForm.cFileName" />
        </el-form-item>
        <el-collapse>
          <el-collapse-item
              v-for="(item, index) in conversationForm.cQuestions"
              :key="item.qId"
              :name="index + 1">
            <template #title style="color: #409EFF">
              问题{{numberToChinese(index)}}详细
              <el-button
                  v-if="displayType!='view'"
                  size="small"
                  type="danger"
                  style="margin-left: 50px"
                  :disabled="conversationForm.cQuestions.length <= 1"
                  @click.stop="clickDeleteQuestionButton(index)"
                  text
                  bg
              >删除问题</el-button>
            </template>
            <el-form-item label="问题">
              <el-input v-model="item.question" />
            </el-form-item>
            <el-form-item label="A选项">
              <el-input v-model="item.aOption" />
            </el-form-item>
            <el-form-item label="B选项">
              <el-input v-model="item.bOption" />
            </el-form-item>
            <el-form-item label="C选项">
              <el-input v-model="item.cOption" />
            </el-form-item>
            <el-form-item label="D选项">
              <el-input v-model="item.dOption" />
            </el-form-item>
            <el-form-item label="E选项">
              <el-input v-model="item.eOption" />
            </el-form-item>
            <!--                <el-form-item label="本题答案">-->
            <!--                  <el-select v-model="item.answer" class="m-2" placeholder="Answer">-->
            <!--                    <el-option-->
            <!--                        v-for="element in options"-->
            <!--                        :key="element.value"-->
            <!--                        :label="element.label"-->
            <!--                        :value="element.value"/>-->
            <!--                  </el-select>-->
            <!--                </el-form-item>-->
            <el-form-item label="第一次提示">
              <el-input
                  v-model="item.firstTip"
                  :autosize="{ minRows: 4}"
                  resize="none"
                  type="textarea" />
            </el-form-item>
            <el-form-item label="第二次提示">
              <el-input
                  v-model="item.secondTip"
                  :autosize="{ minRows: 4}"
                  resize="none"
                  type="textarea" />
            </el-form-item>
            <el-form-item label="第三次提示">
              <el-input
                  v-model="item.thirdTip"
                  :autosize="{ minRows: 4}"
                  resize="none"
                  type="textarea" />
            </el-form-item>
            <el-form-item label="第四次提示">
              <el-input
                  v-model="item.fourthTip"
                  :autosize="{ minRows: 4}"
                  resize="none"
                  type="textarea" />
            </el-form-item>
            <el-form-item label="第一次干预文本">
              <el-input
                  v-model="item.firstIntervene.iText"
                  :autosize="{ minRows: 7, maxRows: 7 }"
                  resize="none"
                  type="textarea" />
            </el-form-item>
            <el-form-item label="音频文件一">
              <el-input v-model="item.firstIntervene.iFileName" />
            </el-form-item>
            <el-form-item label="第二次干预文本">
              <el-input
                  v-model="item.secondIntervene.iText"
                  :autosize="{ minRows: 5, maxRows: 5 }"
                  resize="none"
                  type="textarea" />
            </el-form-item>
            <el-form-item label="音频文件二">
              <el-input v-model="item.secondIntervene.iFileName" />
            </el-form-item>
            <el-form-item label="第三次干预文本">
              <el-input
                  v-model="item.thirdIntervene.iText"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  resize="none"
                  type="textarea" />
            </el-form-item>
            <el-form-item label="音频文件三">
              <el-input v-model="item.thirdIntervene.iFileName" />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-button
            v-if="displayType!='view'"
            type="primary"
            style="width: 100%; margin-top: 10px"
            :disabled="conversationForm.cQuestions.length >= 3"
            @click="clickAddQuestionButton"
            text
            bg
        >添加问题</el-button>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script>
  import  { mapState, mapMutations, mapActions } from 'vuex'
  export default {
    props: {
      conversationId: {
        type: String,
        default: ''
      },
      displayType: {
        type: String,
        default: ''
      }
    },
    created() {
      // 请求假数据
      if (this.conversationId) {
        this.getConversationData(this.conversationId)
      }
    },
    watch: {
      conversationId: {
        handler(newValue, oldValue) {
          if (newValue) {
            this.getConversationData(newValue)
          } else {
            this.conversationForm = {
              cId: 1,
              cName: "",
              cTextSummary: ``,
              cText: ``,
              cFileName: "",
              cQuestions: [
                {
                  qId: 1,
                  question: "", aOption: "", bOption: "", cOption: "", dOption: "", eOption: "",
                  answer: "",
                  firstTip: "", secondTip: "", thirdTip: "", fourthTip: "",
                  firstIntervene: { iText: ``, iFileName: "" },
                  secondIntervene: { iText: ``, iFileName: "" },
                  thirdIntervene: { iText: ``, iFileName: "" }
                }
              ]
            }
          }
        },
        deep: true
      }
    },
    data() {
      return {
        conversationForm: {
          cId: 1,
          cName: "",
          cTextSummary: ``,
          cText: ``,
          cFileName: "",
          cQuestions: [
            {
              qId: 1,
              question: "",
              aOption: "",
              bOption: "",
              cOption: "",
              dOption: "",
              eOption: "",
              answer: "",
              firstTip: "",
              secondTip: "",
              thirdTip: "",
              fourthTip: "",
              firstIntervene: {
                iText: ``,
                iFileName: ""
              },
              secondIntervene: {
                iText: ``,
                iFileName: ""
              },
              thirdIntervene: {
                iText: ``,
                iFileName: ""
              }
            }
          ]
        },
        options: [
          { value: 'A', label: 'A' },
          { value: 'B', label: 'B' },
          { value: 'C', label: 'C' },
          { value: 'D', label: 'D' },
          { value: 'E', label: 'E' }
        ]
      }
    },
    methods: {
      ...mapActions(['getConversationByCId']),
      numberToChinese(index) {
        const ChineseNumber = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
        return ChineseNumber[index]
      },
      clickAddQuestionButton() {
        const question = {
          qId: Date.now(),
          question: "",
          aOption: "",
          bOption: "",
          cOption: "",
          dOption: "",
          eOption: "",
          answer: "",
          firstTip: "",
          secondTip: "",
          thirdTip: "",
          fourthTip: "",
          firstIntervene: {
            iText: ``,
            iFileName: ""
          },
          secondIntervene: {
            iText: ``,
            iFileName: ""
          },
          thirdIntervene: {
            iText: ``,
            iFileName: ""
          }
        }
        this.conversationForm.cQuestions.push(question)
      },
      clickDeleteQuestionButton(index) {
        this.conversationForm.cQuestions.splice(index, 1)
      },
      getConversationData(cId) {
        const mockRequestData = {
          cId: cId,
        }
        this.getConversationByCId(mockRequestData)
        this.conversationForm = this.conversationData
      }
    },
    computed: {
      ...mapState(['conversationData'])
    }
  }
</script>

<style>
 .el-collapse-item__header {
   color: #409EFF;
 }
</style>