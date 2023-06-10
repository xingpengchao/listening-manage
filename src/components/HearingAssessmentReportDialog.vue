<template>
  <div>
    <el-dialog
      class="report_dialog"
      v-model="reportDialogDisplay"
      title="听力评估报告"
      width="991"
      align-center
      destroy-on-close
      @close="reportDialogClose">
      <el-scrollbar max-height="530px" style="width: 961px;">
        <div class="display_items">
          <span class="display_item" style="margin-right: 50px">学号：04180001</span>
          <span class="display_item" style="margin-right: 50px">姓名：小李</span>
          <span class="display_item">测试：Test1</span>
        </div>
        <div style="border: 1px solid black;width: 949px;">
          <el-row>
            <el-col :span="8">
              <div class="center_style"><span>在本次测试中，</span></div>
              <div style="margin: 5px 5px 5px 5px">
                <span>我的总得分：48（试题总分：64分） 在全部作答的学生中，我排在1.0%。 我共答对12道题目，其中不同难度 题目所占百分比如右图所示。</span>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="center_style"><span>我的答题情况</span></div>
              <canvas id="areaChartOne"></canvas>
            </el-col>
            <el-col :span="8">
              <div class="center_style"><span>全部学生作答情况</span></div>
              <canvas id="areaChartTwo"></canvas>
            </el-col>
          </el-row>
        </div>
        <span class="display_label">我的整体作答情况如下：</span>
        <div class="display_items">
          <span class="display_item">Test1</span>
        </div>
        <div style="width: 951px">
          <el-row :gutter="2">
            <el-col :span="4">
              <div class="center_style" style="background-color: rgb(210, 222, 239); height: 80px">
                <span>测试日期</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="center_style" style="background-color: rgb(210, 222, 239); height: 80px">
                <span>测试时长</span>
              </div>
            </el-col>
            <el-col :span="8"><div style="height: 80px">
              <el-row style="margin-top: 0px">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 39px">
                    <span>诊断成绩</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2" >
                <el-col :span="12">
                  <div class="center_style" style="background-color: rgb(234, 239, 247); height: 39px">
                    <span>原始分数</span>
                  </div>
                </el-col>
                <el-col :span="12">
                  <div class="center_style" style="background-color: rgb(234, 239, 247); height: 39px">
                    <span>百分制</span>
                  </div>
                </el-col>
              </el-row>
            </div></el-col>
            <el-col :span="4">
              <div class="center_style" style="background-color: rgb(210, 222, 239); height: 80px">
                <span>动态评估成绩</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="center_style" style="background-color: rgb(210, 222, 239); height: 80px">
                <span>学习潜能分数</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="2">
            <el-col :span="4">
              <div class="center_style" style="background-color: rgb(210, 222, 239); height: 40px">
                <span>2020-09-11</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="center_style" style="background-color: rgb(210, 222, 239); height: 40px">
                <span>00:09:05</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="center_style" style="background-color: rgb(210, 222, 239); height: 40px">
                <span>48/64</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="center_style" style="background-color: rgb(210, 222, 239); height: 40px">
                <span>75.0/100</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="center_style" style="background-color: rgb(210, 222, 239); height: 40px">
                <span>60</span>
              </div>
            </el-col>
            <el-col :span="4">
              <div class="center_style" style="background-color: rgb(210, 222, 239); height: 40px">
                <span>1.1</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div style="display:flex;"><span class="display_label">在系统提示情况下，我在每道题目上的表现：</span></div>
        <div style="width: 951px">
          <el-row :gutter="2">
            <el-col :span="6">
              <div class="center_style" style="background-color: rgb(91, 155, 213); height: 40px">
                <span style="color: white">题号</span>
              </div>
            </el-col>
            <el-col :span="16" id="title_header">
              <div v-if="testData.length <= 0" style="background-color: rgb(91, 155, 213); height: 40px" />
              <el-space v-else :size="2">
                <div
                  class="center_style"
                  :style="'background-color: rgb(91, 155, 213); width:'+ dynamicWidth + '; height: 40px'"
                  v-for="(item, index) in testData"
                  :key="item.qId">
                  <span style="color: white">{{item.qId}}</span>
                </div>
              </el-space>
            </el-col>
            <el-col :span="1">
              <div class="center_style" style="background-color: rgb(91, 155, 213); height: 40px">
                <span style="color: white">答对题数</span>
              </div>
            </el-col>
            <el-col :span="1">
              <div class="center_style" style="background-color: rgb(91, 155, 213); height: 40px">
                <span style="color: white">累积分数</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="2">
            <el-col :span="1">
              <div class="center_style" style="background-color: rgb(210, 222, 239); height: 200px">
                <span style="writing-mode: vertical-lr;">提示情况</span>
              </div>
            </el-col>
            <el-col :span="3">
              <el-row :gutter="2" style="margin-top: 0px">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 38px">
                    <span>未提示</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(234, 239, 247); height: 38px">
                    <span>提示一次</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 38px">
                    <span>提示二次</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(234, 239, 247); height: 38px">
                    <span>提示三次</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 38px">
                    <span>提示四次</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="2">
              <el-row :gutter="2" style="margin-top: 0px">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 38px">
                    <span>得4分</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(234, 239, 247); height: 38px">
                    <span>得3分</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 38px">
                    <span>得2分</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(234, 239, 247); height: 38px">
                    <span>得1分</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 38px">
                    <span>得0分</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="16">
              <el-row :gutter="2" style="margin-top: 0px">
                <el-col :span="24">
                  <div v-if="testData.length <= 0" style="background-color: rgb(210, 222, 239); height: 38px" />
                  <el-space v-else :size="2">
                    <div
                      class="center_style"
                      :style="'background-color: rgb(210, 222, 239); width:'+ dynamicWidth + '; height: 38px'"
                      v-for="(item, index) in firstLineData"
                      :key="(index + 1)">
                      <span>{{item}}</span>
                    </div>
                  </el-space>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="24">
                  <div v-if="testData.length <= 0" style="background-color: rgb(210, 222, 239); height: 38px" />
                  <el-space v-else :size="2">
                    <div
                      class="center_style"
                      :style="'background-color: rgb(210, 222, 239); width:'+ dynamicWidth + '; height: 38px'"
                      v-for="(item, index) in secondLineData"
                      :key="(index + 1)">
                      <span>{{item}}</span>
                    </div>
                  </el-space>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="24">
                  <div v-if="testData.length <= 0" style="background-color: rgb(210, 222, 239); height: 38px" />
                  <el-space v-else :size="2">
                    <div
                      class="center_style"
                      :style="'background-color: rgb(210, 222, 239); width:'+ dynamicWidth + '; height: 38px'"
                      v-for="(item, index) in thirdLineData"
                      :key="(index + 1)">
                      <span>{{item}}</span>
                    </div>
                  </el-space>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="24">
                  <div v-if="testData.length <= 0" style="background-color: rgb(210, 222, 239); height: 38px" />
                  <el-space v-else :size="2">
                    <div
                      class="center_style"
                      :style="'background-color: rgb(210, 222, 239); width:'+ dynamicWidth + '; height: 38px'"
                      v-for="(item, index) in fourthLineData"
                      :key="(index + 1)">
                      <span>{{item}}</span>
                    </div>
                  </el-space>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="24">
                  <div v-if="testData.length <= 0" style="background-color: rgb(210, 222, 239); height: 38px" />
                  <el-space v-else :size="2">
                    <div
                      class="center_style"
                      :style="'background-color: rgb(210, 222, 239); width:'+ dynamicWidth + '; height: 38px'"
                      v-for="(item, index) in fifthLineData"
                      :key="(index + 1)">
                      <span>{{item}}</span>
                    </div>
                  </el-space>
                </el-col>
              </el-row>
            </el-col>
            <!-- 答对题数列 -->
            <el-col :span="1">
              <el-row
                v-for="(item, index) in correctAnswerNumber"
                :gutter="2"
                :style="index === 0 ? 'margin-top: 0px' : ''">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 38px">
                    <span>{{item}}</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <!-- 累积分数列 -->
            <el-col :span="1">
              <el-row
                  v-for="(item, index) in correctAnswerScore"
                  :gutter="2"
                  :style="index === 0 ? 'margin-top: 0px' : ''">
                <el-col :span="24">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 38px">
                    <span>{{item}}</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div style="width: 951px">
          <el-row :gutter="2">
            <el-col :span="14">
              <el-row :gutter="2">
                <el-col :span="4">
                  <div class="center_style" style="background-color: rgb(91, 155, 213); height: 40px">
                    <span>听力技能</span>
                  </div>
                </el-col>
                <el-col :span="20">
                  <div class="center_style" style="background-color: rgb(91, 155, 213); height: 40px">
                    <span>定义</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="4">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 60px">
                    <span>词汇与表达</span>
                  </div>
                </el-col>
                <el-col :span="20">
                  <div style="height: 60px">
                    <span>1)能理解词汇或短语在具体情境下的意义和用法</span><br/>
                    <span>2)能识别并理解关键词汇的意义和用法（即有助于确立主题和观点的词汇）</span><br/>
                    <span>3)能理解常见的固定搭配和习惯性口头表达</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="4">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 60px">
                    <span>语法</span>
                  </div>
                </el-col>
                <el-col :span="20">
                  <div style="height: 60px">
                    <span>1)能识别和使用主要的句式结构（虚拟语气，倒装句、否定句等）</span><br/>
                    <span>2)能通过分析句法结构理解长句和难句的意义</span><br/>
                    <span>3)能够识别会话或短文中的衔接手段，并借助其获取关键信息</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="4">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 60px">
                    <span>主旨大意</span>
                  </div>
                </el-col>
                <el-col :span="20">
                  <div style="height: 60px">
                    <span>1)能依据关键信息识别对话或篇章的主题</span><br/>
                    <span>2)能理解说话者的观点和意图</span><br/>
                    <span>3)能概括主要内容</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="4">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 60px">
                    <span>细节</span>
                  </div>
                </el-col>
                <el-col :span="20">
                  <div style="height: 60px">
                    <span>1)能听懂细节并掌握关键信息，如人物、事件、时间等</span><br/>
                    <span>2)能根据语篇特征区分主要信息和次要信息</span><br/>
                    <span>3)能区分信息之间的异同</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="4">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 60px">
                    <span>推理</span>
                  </div>
                </el-col>
                <el-col :span="20">
                  <div style="height: 60px">
                    <span>1)能结合语境、个人知识与经验或社会文化知识理解理解话语的隐含意义</span><br/>
                    <span>2)能理解话语的交际功能</span><br/>
                    <span>3)能依据上下文推理不熟悉词汇的意义</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="10">
              <div class="center_style"><span class="display_label">听力技能掌握概率-雷达图</span></div>
              <canvas id="radarChart" style="max-height: 310px"></canvas>
            </el-col>
          </el-row>
        </div>
        <div style="width: 951px">
          <el-row :gutter="2">
            <el-col :span="14">
              <div class="center_style"><span class="display_label">动态评估下的个人听力技能</span></div>
              <el-row :gutter="2">
                <el-col :span="5">
                  <div class="center_style" style="background-color: rgb(91, 155, 213); height: 40px">
                    <span>听力技能</span>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="center_style" style="background-color: rgb(91, 155, 213); height: 40px">
                    <span>相关题目</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="center_style" style="background-color: rgb(91, 155, 213); height: 40px">
                    <span>总提示频率</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="center_style" style="background-color: rgb(91, 155, 213); height: 40px">
                    <span>平均提示频率</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="5">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 30px">
                    <span>词汇与表达</span>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="center_style" style="height: 30px">
                    <span>3、4</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="center_style" style="height: 30px">
                    <span>0</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="center_style" style="height: 30px">
                    <span>0.0</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="5">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 30px">
                    <span>语法</span>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="center_style" style="height: 30px">
                    <span>7、8</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="center_style" style="height: 30px">
                    <span>1</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="center_style" style="height: 30px">
                    <span>0.5</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="5">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 30px">
                    <span>主旨大意</span>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="center_style" style="height: 30px">
                    <span>5、6</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="center_style" style="height: 30px">
                    <span>0</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="center_style" style="height: 30px">
                    <span>0.0</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="5">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 30px">
                    <span>细节</span>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="center_style" style="height: 30px">
                    <span>10、11、12、13、14、15、16</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="center_style" style="height: 30px">
                    <span>3</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="center_style" style="height: 30px">
                    <span>0.4</span>
                  </div>
                </el-col>
              </el-row>
              <el-row :gutter="2">
                <el-col :span="5">
                  <div class="center_style" style="background-color: rgb(210, 222, 239); height: 30px">
                    <span>推理</span>
                  </div>
                </el-col>
                <el-col :span="9">
                  <div class="center_style" style="height: 30px">
                    <span>1、2、9</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="center_style" style="height: 30px">
                    <span>0</span>
                  </div>
                </el-col>
                <el-col :span="5">
                  <div class="center_style" style="height: 30px">
                    <span>0.0</span>
                  </div>
                </el-col>
              </el-row>
            </el-col>
            <el-col :span="10">
              <div class="center_style"><span class="display_label">再来看看我在群体中的表现吧！</span></div>
              <canvas id="barChart"></canvas>
            </el-col>
          </el-row>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "HearingAssessmentReportDialog",
  props: {
    isShowDialog: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    isShowDialog: {
      handler(newValue, oldValue) {
        this.reportDialogDisplay = newValue
        if (newValue) {
          this.$nextTick(() => {
            this.renderAreaChartOne()
            this.renderAreaChartTwo()
            this.renderRadarChart()
            this.renderBarChart()
            this.renderAnswerProcess()
          })
        }
      },
      deep: true
    },
  },
  data() {
    return {
      reportDialogDisplay: false,
      testData: [
        {
          qId: 1,
          process: ['A', 'C', 'D', 'E', 'B']
        },
        {
          qId: 2,
          process: ['C', 'A', 'B', 'D']
        },
        {
          qId: 3,
          process: ['B', 'C', 'A']
        },
        {
          qId: 4,
          process: ['B', 'C']
        },
        {
          qId: 5,
          process: ['D']
        },
        {
          qId: 6,
          process: ['A', 'C', 'D', 'E', 'B']
        },
        {
          qId: 7,
          process: ['C', 'A', 'B', 'D']
        },
        {
          qId: 8,
          process: ['B', 'C', 'A']
        },
        {
          qId: 9,
          process: ['B', 'C']
        },
        {
          qId: 10,
          process: ['D']
        },
        {
          qId: 11,
          process: ['A', 'C', 'D', 'E', 'B']
        },
        {
          qId: 12,
          process: ['C', 'A', 'B', 'D']
        },
        {
          qId: 13,
          process: ['B', 'C', 'A']
        },
        {
          qId: 14,
          process: ['B', 'C']
        },
        {
          qId: 15,
          process: ['D']
        },
        {
          qId: 16,
          process: ['D']
        }
      ],
      firstLineData: [],
      secondLineData: [],
      thirdLineData: [],
      fourthLineData: [],
      fifthLineData: [],
      dynamicWidth: ''
    }
  },
  methods: {
    reportDialogClose() {
      this.reportDialogDisplay = false
      this.$emit("closeDialog", this.reportDialogDisplay)
    },
    renderAreaChartOne() {
      const ctx = document.getElementById('areaChartOne');
      new Chart(ctx, {
        type: 'pie', // 饼状图
        data: {
          labels: [
            '高难度',
            '容易',
            '中等难度'
          ],
          datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
        }
      });
    },
    renderAreaChartTwo() {
      const ctx = document.getElementById('areaChartTwo');
      new Chart(ctx, {
        type: 'pie', // 饼状图
        data: {
          labels: [
            '高难度',
            '容易',
            '中等难度'
          ],
          datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
          }]
        }
      });
    },
    renderRadarChart() {
      const ctx = document.getElementById('radarChart');
      new Chart(ctx, {
        type: 'radar',
        data: {
          labels: [
            '词汇与表达',
            '语法',
            '主旨大意',
            '细节',
            '推理'
          ],
          datasets: [{
            // label: 'My Second Dataset',
            data: [0, 0.3, 0.5, 0.8, 0.2],
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)'
          }]
        },
        options: {
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 1
            }
          },
          plugins: {
            legend: { display: false },
          },
          elements: {
            line: {
              borderWidth: 2
            }
          }
        },
      });
    },
    renderBarChart() {
      const ctx = document.getElementById('barChart');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['词汇与表达', '语法', '主旨大意', '细节', '推理'],
          datasets: [
            {
              label: '我的总提示频率',
              data: [0, 1, 0, 3, 0],
              borderWidth: 1
            },
            {
              label: '全部学生平均总提示频率',
              data: [0, 1, 1, 6, 2],
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },
    renderAnswerProcess() {
      const ctx = document.getElementById('title_header');
      // 最多显示34个题目
      this.dynamicWidth = (ctx.clientWidth / this.testData.length - 2) + 'px'
      this.firstLineData = this.testData.map((element) => {
        return element.process.length === 1 ? "√" : ""
      })
      this.secondLineData = this.testData.map((element) => {
        return element.process.length === 2 ? "√" : ""
      })
      this.thirdLineData = this.testData.map((element) => {
        return element.process.length === 3 ? "√" : ""
      })
      this.fourthLineData = this.testData.map((element) => {
        return element.process.length === 4 ? "√" : ""
      })
      this.fifthLineData = this.testData.map((element) => {
        return element.process.length === 5 ? "√" : ""
      })
      console.log(this.firstLineData)
    }
  },
  computed: {
    correctAnswerNumber() {
      const arrayList = []
      arrayList[0] = this.firstLineData.reduce((previousValue, currentValue) => {
        return currentValue ? previousValue + 1 : previousValue
      }, 0)
      arrayList[1] = this.secondLineData.reduce((previousValue, currentValue) => {
        return currentValue ? previousValue + 1 : previousValue
      }, 0)
      arrayList[2] = this.thirdLineData.reduce((previousValue, currentValue) => {
        return currentValue ? previousValue + 1 : previousValue
      }, 0)
      arrayList[3] = this.fourthLineData.reduce((previousValue, currentValue) => {
        return currentValue ? previousValue + 1 : previousValue
      }, 0)
      arrayList[4] = this.fifthLineData.reduce((previousValue, currentValue) => {
        return currentValue ? previousValue + 1 : previousValue
      }, 0)
      return arrayList
    },
    correctAnswerScore() {
      return this.correctAnswerNumber.map((item, index) => {
        return Number(item) * (4 - index)
      })
    }
  }
}
</script>

<style>

.report_dialog .el-dialog__body {
  padding-top: 5px;
}

.el-row {
  margin-top: 2px;
}

.display_items {
  /*下面三行代码的作用是让一个div中的元素上下左右居中*/
  display:flex;
  justify-content:center;
  align-items:center;
  background-color: rgb(91, 155, 213);
  width: 951px;
  height: 33px
}

.center_style {
  /*下面三行代码的作用是让一个div中的元素上下左右居中*/
  display:flex;
  justify-content:center;
  align-items:center;
}

.display_item {
  font-size: 20px;
  font-style: normal;
  color: white;
}

.display_label {
  float: left;
  font-size: 19px;
  font-weight: bold;
  margin: 5px 0;
}

</style>