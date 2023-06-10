<template>
<!--  <div v-if="isFill == true" >-->
    <div>
    <div v-if="explainFlag" class="container">
      <span class="ex_name">测试说明</span>
      <p>欢迎同学使用听力动态评估系统进行听力练习</p>
      <p>本次测试一共有4个对话</p>
      <p>每个对话有1到3个不等的问题</p>
      <p>本次测试一共有8个问题</p>
      <p>每个问题有5个选项，正确选项只有一项</p>
      <p>选错其余四项后，会出现一次文本提示</p>
      <p>学生阅读完文本提示后，会播放干预音频进行再次答题</p>
      <p>其中每个问题的干预次数只有三次，每次答案的范围依次缩小</p>
      <span class="answer_button"><el-button type="primary" @click="clickExecuteExaminationButton">开始答题</el-button></span>
    </div>

        <div v-else style="margin-left: 100px">
            <div v-for="(conversation,index) in currentStudentExamination.currentConversationList" :key="index">
               <h3>{{conversation.title_text }}这是大题的标题</h3>
                <audio
                        style="width: 500px; margin-top: 10px"
                        controls="controls"
                        preload="true"
                        @canplay="" @timeupdate="" @ended="handleAudioEnded"
                        ref="audio" :src="audioSrc">
                    <!--（1）属性：controls，preload（2）事件：canplay，timeupdate，ended（3）方法：play()，pause() -->
                    <!--controls：向用户显示音频控件（播放/暂停/进度条/音量）-->
                    <!--preload：属性规定是否在页面加载后载入音频-->
                    <!--canplay：当音频/视频处于加载过程中时，会发生的事件-->
                    <!--timeupdate：当目前的播放位置已更改时-->
                    <!--ended：当目前的播放列表已结束时-->
                </audio>
<!--                <span>{{currentStudentExamination.currentPaperMinList}}</span> //-->
                <div v-for="(min, i) in currentStudentExamination.currentPaperMinList" :key="i">
<!--                     <P>{{min[i].title_num}}</P>-->
                    <div v-if="min[0].title_num === conversation.title_num" style="text-align: left">
                        <template v-if="true">
                            <div v-for="(minDetail, j) in min" :key="j">
<!--                                <p>{{ minDetail }}</p>-->
                                <p>第{{j+1 }}题：{{ minDetail.title_text }}这是小题的标题</p >
                                <p style="display: none">{{ formatAnswerText(minDetail.answer_text) }}</p >
                                  <el-radio-group  style="display: flex; flex-flow: column nowrap; align-items: flex-start"  v-model="stuAnswer[j]">
                                      <el-radio label="A" size="large" :disabled="aFlag">{{'A) ' + answerTextList.aOption}}</el-radio>
                                      <el-radio label="B" size="large" :disabled="bFlag">{{'B) ' + answerTextList.bOption}}</el-radio>
                                      <el-radio label="C" size="large" :disabled="aFlag">{{'C) ' + answerTextList.cOption}}</el-radio>
                                      <el-radio label="D" size="large" :disabled="aFlag">{{'D) ' + answerTextList.dOption}}</el-radio>
                                      <el-radio label="E" size="large" :disabled="aFlag">{{'E) ' + answerTextList.eOption}}</el-radio>
                                  </el-radio-group>
                                <button @click="submitAnswer(minDetail,j)" style="margin-bottom: 10px" :disabled="disabled">提交答案</button>
                                <button v-if="answered && !correctAnswer" @click="showIntervention" :disabled="disabled" style="margin-bottom: 10px" >查看干预</button>
                                <button v-if="answered && !correctAnswer" @click="showIntervention" :disabled="viewAllIntervention" style="margin-bottom: 10px" >查看所有干预</button>
                            </div>
                        </template>
                    </div>
                    <!-- <p>该大题下的小题展示结束啦</p >-->
                </div>
            <button>下一题</button>
        </div>
        </div>
    </div>

</template>
<script>
import {mapActions, mapState} from "vuex";
import {ElMessage} from "element-plus";
import FeedbackQuestionnaireDialog from "@/components/FeedbackQuestionnaireDialog";
import StudentExaminationInfo from "@/views/StudentExaminationInfo";
import ViewMeddleInfoDialog from "@/components/ViewMeddleInfoDialog";
export default {
    name: "ExecuteExaminationPage",
    created() {
        // console.log('eid: ' + this.$route.query.id + 'sId' + this.user.id )
        this.currentStudentExamination.currentConversationList = this.$store.state.currentStudentExamination.currentConversationList
        this.currentStudentExamination.currentStudentParer = this.$store.state.currentStudentExamination.currentStudentParer
        this.currentStudentExamination. currentPaperMinList = this.$store.state.currentStudentExamination.currentPaperMinList
        this.currentStudentExamination. currentMinInterveneList = this.$store.state.currentStudentExamination.currentMinInterveneList

        console.log( this.currentStudentExamination.currentPaperMinList )
        console.log(this.currentStudentExamination)
    },
    data(){
        return{
            currentStudentExamination:{ //当前学生考试使用的试卷
                currentStudentParer:[],//试卷的总体信息
                currentConversationList:[], //当前学生考试使用试卷的大题
                currentPaperMinList:[],
                currentMinInterveneList:[],
            },
            explainFlag: true,
            radio:false,
            answerTextList1:[],
            answerTextList:{
                aOption:'',
                bOption:'',
                cOption:'',
                dOption:'',
                eOption:'',
            },
            selectedChoice: '',//表示用户选择的答案
            questionName: "question1",
            answered:false, //表示用户是否已经提交了该小题的答案
            correctAnswer:false,//表示用户提交的答案是否正确
            disabled:false,//表示该组件是否被禁用，如果为true，则组件中的所有交互元素（如按钮、输入框等）都将被禁用，否则可以正常使用
        //     当大题组件的 audioEnded 属性为 false 时，所有小题组件的 disabled 属性都将被设置为 true，禁止用户提交答案或查看干预内容。
            //     当用户点击播放按钮后，大题组件的 audioEnded 属性将被设置为 true，所有小题组件的 disabled 属性都将被解除，用户可以正常提交答案或查看干预内容。
            audioSrc:'',//音频文件的URL
            audioEnded: false,//
            stuAnswer:[],//学生答案
            aFlag: false,
            bFlag: false,//选项是否禁用
            cFlag: false,
            dFlag: false,
            eFlag: false,
            questionNumber:0,
            viewAllIntervention:false,//查看所有干预提示
            questionCount: 0 ,//


    }
    },
    methods:{
        handleAudioEnded(){
            this.audioEnded = true
        },
        radioChange(){
            this.radio = true
        },
        //显示干预内容
        showIntervention(){
            console.log('显示干预内容')
        },
        submitAnswer(minDetail,number) {
            console.log(minDetail.title_min_num)
            this.answered = false
            console.log(this.stuAnswer[number])
            this.questionCount += 1

            if (this.selectedChoice === minDetail.answer) {

                //学生选择正确，记录答案 需要显示 查看所有干预按钮
                // this.correctAnswer = true //用户提交的答案是正确的
                this.viewAllIntervention = true //显示所有干预提示
                this.aFlag = false // 被禁用的选项解禁
                this.bFlag = false
                this.cFlag = false
                this.dFlag = false
                this.eFlag = false
                this.saveAdditionalQuestionAnswer() //记录答案
                // this.stuAnswer[number ] += this.stuAnswer[number]
                console.log(`提交小题${number}的答案：${this.stuAnswer[number]}`);
            } else {
                //学生选择错误
                if (this.answerTextList.aOption === 'A') {
                    this.aFlag = true
                }
                this.stuAnswer[number ] += this.stuAnswer[number] + '+'
                console.log(`提交小题${number}的答案：${this.stuAnswer[number]}`);
                console.log('你的回答是错的')
            }

            console.log(this.stuAnswer)
        },
        saveAdditionalQuestionAnswer() {
            // this.additionalQuestionDialogVisible = false
            let successMessage = ''
            if (this.currentQuestionOrder === this.questionNumber) {
                if (this.currentConversationOrder === this.paperData.length) {
                    // this.timeStr = this.examineeAnswer[this.currentQuestion.qId + '-answer-duration']
                    successMessage = '您已答完所有问题，可以交卷了 !'
                    this.submitFlag = true
                } else {
                    successMessage = '当前题目已完成，进入下一个对话'
                    this.currentQuestionOrder = 0
                    this.nextConversationSetting()
                }
            } else {
                successMessage = '当前题目已完成，进入下一题'
                this.questionSetting()
            }
            ElMessage({
                message: successMessage,
                type: 'success',
                duration: 2000
            })
        },
        formatChoiceText(choice, index) {
            const letter = String.fromCharCode(65 + index);
            return `${letter}. ${choice}`;
        },
        selectChoice(choice) {
            if(choice === 0){
                this.selectedChoice = 'A'
            }else if(choice === 1){
                this.selectedChoice = 'B'
            }else if(choice === 2){
                this.selectedChoice = 'C'
            }else if(choice === 3){
                this.selectedChoice = 'D'
            }else if(choice === 4){
                this.selectedChoice = 'E'
            }

        },
        formatAnswerText(answer_text) {
            this.answerTextList1 = answer_text.split('+');
            this.answerTextList.aOption = this.answerTextList1[0]
            this.answerTextList.bOption = this.answerTextList1[1]
            this.answerTextList.cOption = this.answerTextList1[2]
            this.answerTextList.dOption = this.answerTextList1[3]
            this.answerTextList.eOption = this.answerTextList1[4]
           // console.log(this.answerTextList)
            return this.answerTextList
        },
        clickExecuteExaminationButton(){
            this.explainFlag = false
        },
    },
}
</script>

<style>


.container {
  text-align: center;
}

.ex_name {
  font-size: 20px;
  font-style: normal;
  opacity: 0.8;
  text-align: center;
}

.hint_dialog .el-dialog__body {
  padding-top: 5px;
}

 .radio-list {
     list-style: none;
     padding: 0;
     margin: 0;
 }

.radio-list li {
    margin-bottom: 10px;
}

.radio-option {
    display: flex;
    align-items: center;
    cursor: pointer;
}

.radio-option input[type="radio"] {
    margin-right: 10px;
}

.radio-label {
    flex: 1;
}

</style>