<template>
    <div>
        <el-dialog
                v-model="conversationDialogDisplay"
                :title="dialogTitle"
                align-center
                destroy-on-close
                @close="ConversationFormDialogClose">
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
                        <div>
                            <el-upload
                                    :before-upload="beforeUpload"
                                    :auto-upload="true"
                                    accept="audio/*">
                                <el-button type="primary" @click="uploadAudio">上传音频文件</el-button>
                            </el-upload>
                        </div>

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
                                <el-form-item label="答案">
                                    <el-select v-model="item.answer">
                                        <el-option label="Option A" value="A"></el-option>
                                        <el-option label="Option B" value="B"></el-option>
                                        <el-option label="Option C" value="C"></el-option>
                                        <el-option label="Option D" value="D"></el-option>
                                        <el-option label="Option E" value="E"></el-option>
                                    </el-select>
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
                                <el-form-item label="第一次干预文本" v-show="this.proxy == true">
                                    <el-input
                                            v-model="item.firstIntervene.iText"
                                            :autosize="{ minRows: 7, maxRows: 7 }"
                                            resize="none"
                                            type="textarea" />
                                </el-form-item>
                                <el-form-item label="音频文件一" v-show="this.proxy == true">
                                    <el-upload
                                            :before-upload="beforeUpload1"
                                            :auto-upload="true"
                                            accept="audio/*">
                                        <el-button type="primary" @click="uploadAudio">上传第一次干预音频文件</el-button>
                                    </el-upload>
                                    <div slot="tip" class="el-upload__tip">只能上传音频文件</div>
                                </el-form-item>
                                <el-form-item label="第二次干预文本" v-show="this.proxy == true">
                                    <el-input
                                            v-model="item.secondIntervene.iText"
                                            :autosize="{ minRows: 5, maxRows: 5 }"
                                            resize="none"
                                            type="textarea" />
                                </el-form-item>
                                <el-form-item label="音频文件二" v-show="this.proxy == true">
                                    <el-upload
                                            :before-upload="beforeUpload2"
                                            :auto-upload="true"
                                            accept="audio/*">
                                        <el-button type="primary" @click="uploadAudio">上传第二次干预音频文件</el-button>
                                    </el-upload>
                                    <div slot="tip" class="el-upload__tip">只能上传音频文件</div>
                                </el-form-item>
                                <el-form-item label="第三次干预文本" v-show="this.proxy== true">
                                    <el-input
                                            v-model="item.thirdIntervene.iText"
                                            :autosize="{ minRows: 3, maxRows: 3 }"
                                            resize="none"
                                            type="textarea" />
                                </el-form-item>
                                <el-form-item label="音频文件三" v-show="this.proxy == true">
                                    <el-upload
                                        :before-upload="beforeUpload3"
                                        :auto-upload="true"
                                        accept="audio/*">
                                        <el-button type="primary" @click="uploadAudio">上传第三次干预音频文件</el-button>
                                    </el-upload>
                                    <div slot="tip" class="el-upload__tip">只能上传音频文件</div>
                                </el-form-item>
                                <el-form-item label="第四次干预文本" v-show="this.proxy== true">
                                    <el-input
                                        v-model="item.fourthIntervene.iText"
                                        :autosize="{ minRows: 3, maxRows: 3 }"
                                        resize="none"
                                        type="textarea" />
                                </el-form-item>
                                <el-form-item label="音频文件四" v-show="this.proxy == true">
                                    <el-upload
                                        :before-upload="beforeUpload4"
                                        :auto-upload="true"
                                        accept="audio/*">
                                        <el-button type="primary" @click="uploadAudio">上传第四次干预音频文件</el-button>
                                    </el-upload>
                                    <div slot="tip" class="el-upload__tip">只能上传音频文件</div>
                                </el-form-item>
                            </el-collapse-item>
                        </el-collapse>
                        <el-button
                                v-if="displayType!=='view'"
                                type="primary"
                                style="width: 100%; margin-top: 10px"
                                :disabled='conversationForm.cQuestions.length>=3'
                                @click="clickAddQuestionButton"
                                text
                                bg
                        >添加问题</el-button>
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
import {HttpManager} from "@/api";
import {boolean} from "mockjs/src/mock/random/basic";
import {ElMessage} from "element-plus";
import {CODE} from "@/resources/common";
export default {
    props: {
        isShowDialog: {
            type: Boolean,
            default: false
        },
        conversationId: {
            type: Number,
            default: null
        },
        displayType: {
            type: String,
            default: ''
        },
        num:{
            type:Number,
            default:null
        },
        total:{
            type:Number,
            default:null
        },
        proxy:{
            type:Boolean,
            default:false
        }
    },
    created() {
        // 请求数据
        if (this.conversationId) {
            this.getConversationData(this.conversationId)
        } else{
            console.log('531')
        }
    },
    //深度监听 变量变化就会执行
    watch: {
        isShowDialog: {
            handler(newValue, oldValue) {
                this.conversationDialogDisplay = newValue
            },
            deep: true
        },
        conversationId: {
            async handler(newValue, oldValue) {
                if (this.conversationList.length!==0&&newValue<=this.conversationList[this.conversationList.length-1].title_num) {
                    this.getConversationData(newValue)
                    this.conversationForm.cId=this.conversationId
                    const param={
                        num:this.num,
                        title_num:this.conversationId}
                    await this.getPaperMinList(param)
                    this.conversationForm.cQuestions=[]
                    for (var i=0;i<this.paperminlist.length;i=i+1){
                        var paraminter={
                            num:this.num,
                            title_num:this.conversationId,
                            title_min_num:this.paperminlist[i].title_min_num
                        }
                        let question = {
                            qId: this.qNum+1,
                            question: "",
                            aOption: "",
                            bOption: "",
                            cOption: "",
                            dOption: "",
                            eOption: "",
                            answer: "",
                            firstIntervene: {
                                iText: ``,
                                iFileName: null
                            },
                            secondIntervene: {
                                iText: ``,
                                iFileName: null
                            },
                            thirdIntervene: {
                                iText: ``,
                                iFileName: null
                            },
                            fourthIntervene: {
                                iText: ``,
                                iFileName: null
                            }
                        }
                        question.answer=this.paperminlist[i].answer;
                        question.qId=this.paperminlist[i].title_min_num;
                        question.question=this.paperminlist[i].title_text;
                        let answer_abcde=this.paperminlist[i].answer_text.split('+');
                        question.aOption=answer_abcde[0]
                        question.bOption=answer_abcde[1]
                        question.cOption=answer_abcde[2]
                        question.dOption=answer_abcde[3]
                        question.eOption=answer_abcde[4]
                        if(this.proxy===true) {
                            await this.getInterList(paraminter)
                            question.firstIntervene.iText = this.interList[0].inter_text
                            question.secondIntervene.iText=this.interList[1].inter_text
                            question.thirdIntervene.iText=this.interList[2].inter_text
                            question.fourthIntervene.iText=this.interList[3].inter_text
                        }
                        this.conversationForm.cQuestions.push(question)
                    }
                }
                else {
                    console.log("新的对话")
                    console.log(this.conversationId)
                    console.log(this.total)
                    console.log(this.conversationList)
                    this.conversationForm = {
                        file:null,
                        cId: this.conversationId,
                        cName: "",
                        cTextSummary: ``,
                        cText: ``,
                        cFileName: "",
                        qNum: 1,
                        cQuestions: [
                            {
                                qId: 1,
                                question: "", aOption: "", bOption: "", cOption: "", dOption: "", eOption: "",
                                answer: "",
                                firstIntervene: { iText: ``, iFileName: null },
                                secondIntervene: { iText: ``, iFileName: null },
                                thirdIntervene: { iText: ``, iFileName: null },
                                fourthIntervene: { iText: ``, iFileName: null },
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
            file:null,
            conversationDialogDisplay: false,
            currentExaminationId:null,
            qNum:1,
            conversationForm: {
                cId: null,
                cName: "",
                cTypes: '',//对话的测试类型 0前测 1中间测 2后测  （0 2 没有干预提示）
                cTextSummary: ``,
                cText: ``,
                cFileName: "",
                test:[],
                cQuestions: [],
                Inters:[],
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
        boolean,
        ...mapActions(['getConversationByCId','getPaperMinList','getInterList']),
        numberToChinese(index) {
            const ChineseNumber = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
            return ChineseNumber[index]
        },
        conversationTypesChange(){
            console.log(this.conversationForm.cTypes )
        },
        clickAddQuestionButton() {
            if(this.conversationForm.cQuestions[this.qNum-1].question===""||this.conversationForm.cQuestions[this.qNum-1].aOption===""||
                this.conversationForm.cQuestions[this.qNum-1].bOption===""||this.conversationForm.cQuestions[this.qNum-1].cOption===""||
                this.conversationForm.cQuestions[this.qNum-1].dOption===""||this.conversationForm.cQuestions[this.qNum-1]. eOption===""||
                this.conversationForm.cQuestions[this.qNum-1].answer==="")
            {
                ElMessage.warning("请把上一个该小题的内容写完整，确定后添加下一个小题")
                return
            }
            const question = {
                qId: this.qNum,
                question: "",
                aOption: "",
                bOption: "",
                cOption: "",
                dOption: "",
                eOption: "",
                answer: "",
                firstIntervene: {
                    iText: ``,
                    iFileName: null
                },
                secondIntervene: {
                    iText: ``,
                    iFileName: null
                },
                thirdIntervene: {
                    iText: ``,
                    iFileName: null
                },
                fourthIntervene: {
                    iText: ``,
                    iFileName: null
                },
            }
            this.conversationForm.cQuestions.push(question)
            this.qNum=this.qNum+1
        },
        clickDeleteQuestionButton(index) {
            this.conversationForm.cQuestions.splice(index, 1)
            this.qNum=this.qNum-1
        },
        getConversationData(cId) {
            const mockRequestData = {
                title_num:cId
            }
            this.getConversationByCId(mockRequestData)
            this.conversationForm.cId = this.conversationData.title_num
            this.conversationForm.cName = "test"
            this.conversationForm.cText= this.conversationData.title_text
        },
        ConversationFormDialogClose() {
            this.conversationDialogDisplay = false
            this.$emit("closeDialog", this.conversationDialogDisplay)
        },
        clickCancelButton() {
            this.conversationDialogDisplay = false
            this.$emit("closeDialog", this.conversationDialogDisplay)
        },
        async clickConfirmButton() {

            if(!this.num)
            {
                ElMessage.warning("请先选择试卷")
                console.log("error")
                this.$emit("closeDialog", this.conversationDialogDisplay)
                return
            }
            this.conversationDialogDisplay = false
            if(this.file!==null) {
                const paramfile = {
                    paperNum: this.num,
                    titleNum: this.conversationForm.cId,
                    MultipartFile: this.file
                }
                await HttpManager.addPaperListen(paramfile).then((res) => {
                    if (res.code !== CODE.OK_200) {
                        this.$emit("closeDialog", this.conversationDialogDisplay)
                        ElMessage.warning("出错了")
                    }
                })
            }
            const params = {
                num: this.num,
                title_num: this.conversationForm.cId,
                title_total: this.qNum,
                title_text: this.conversationForm.cText,
            }
            //添加大题
            await HttpManager.addPaper(params)
                .then((res)=>{
                    if (res.code === CODE.OK_200) {
                        ElMessage.success("good")
                    } else {
                        ElMessage.warning("添加大题时wrong")
                        this.$emit("closeDialog", this.conversationDialogDisplay)
                        return
                    }
                })
            for (var i = 0; i < this.conversationForm.cQuestions.length; i=i+1) {
                var param = {
                    num: this.num,
                    title_num: this.conversationForm.cId,
                    title_min_num: this.conversationForm.cQuestions[i].qId,
                    title_text: this.conversationForm.cQuestions[i].question,
                    answer_text: this.conversationForm.cQuestions[i].aOption + "+" + this.conversationForm.cQuestions[i].bOption + "+" + this.conversationForm.cQuestions[i].cOption + "+" + this.conversationForm.cQuestions[i].dOption + "+" + this.conversationForm.cQuestions[i].eOption,
                    answer: this.conversationForm.cQuestions[i].answer
                }
                await HttpManager.postpapermin(param)
                    .then((res) => {
                    if (res.code === CODE.OK_200) {
                        ElMessage.success("good")
                    } else {
                        ElMessage.warning("添加小题时wrong")
                        this.$emit("closeDialog", this.conversationDialogDisplay)
                        return
                    }
                })
                //添加试卷的干预文本
                for (var j=1;j<=4;j=j+1){
                    var inter_text
                    var file
                    switch (j){
                       case 1:
                            inter_text=this.conversationForm.cQuestions[i].firstIntervene.iText;
                           file=this.conversationForm.cQuestions[i].firstIntervene.iFileName;
                            break;
                       case 2:
                           inter_text=this.conversationForm.cQuestions[i].secondIntervene.iText;
                           file=this.conversationForm.cQuestions[i].secondIntervene.iFileName;
                           break;
                       case 3:
                           inter_text=this.conversationForm.cQuestions[i].thirdIntervene.iText;
                           file=this.conversationForm.cQuestions[i].thirdIntervene.iFileName;
                           break;
                       case 4:
                           inter_text=this.conversationForm.cQuestions[i].fourthIntervene.iText;
                           file=this.conversationForm.cQuestions[i].fourthIntervene.iFileName;
                           break;

                    }
                    var paramInter={
                        num: this.num,
                        title_num: this.conversationForm.cId,
                        title_min_num: this.conversationForm.cQuestions[i].qId,
                        inter_num:j,
                        inter_text:inter_text
                    }
                    var paramFile={
                        num: this.num,
                        title_num: this.conversationForm.cId,
                        title_min_num: this.conversationForm.cQuestions[i].qId,
                        inter_num:j,
                        file:file
                    }
                    console.log(paramFile)
                    console.log(paramInter)

                    await HttpManager.postPaperIntervene(paramInter)
                        .then((res) => {
                            if (res.code === CODE.OK_200) {
                                ElMessage.success("good")
                            } else {
                                ElMessage.warning("添加干预文本时wrong")
                                this.$emit("closeDialog", this.conversationDialogDisplay)
                                console.log(i)
                                return}
                    })
                    await HttpManager.addPaperIntervenceListen(paramFile)
                        .then((res)=>{
                            if (res.code === CODE.OK_200) {
                                ElMessage.success("good")
                            }else{
                                ElMessage.warning("添加干预音频时wrong")
                                this.$emit("closeDialog", this.conversationDialogDisplay)
                                console.log(i)
                                return
                            }
                        })
                }

            }
            //需要添加  干预提示（干预音频和文本）

            this.$emit("closeDialog", this.conversationDialogDisplay)
        },
        beforeUpload(file){
            this.file=file
            console.log("before")
            console.log(this.file)
            return false; // 阻止自动上传
            // 可以在这里设置一些其他的参数
        },
        beforeUpload3(file) {
            this.conversationForm.cQuestions[this.qNum-1].thirdIntervene.iFileName=file
            console.log(this.qNum)
            console.log(this.conversationForm.cQuestions[this.qNum-1].thirdIntervene.iFileName)
            return false; // 阻止自动上传
            // 可以在这里设置一些其他的参数
        },
        beforeUpload4(file) {
            this.conversationForm.cQuestions[this.qNum-1].fourthIntervene.iFileName=file
            console.log(this.qNum)
            console.log(this.conversationForm.cQuestions[this.qNum-1].fourthIntervene.iFileName)
            return false; // 阻止自动上传
            console.log(this.conversationForm.cQuestions)
            // 可以在这里设置一些其他的参数
        },
        beforeUpload2(file) {
            this.conversationForm.cQuestions[this.qNum-1].secondIntervene.iFileName=file
            console.log("before")
            console.log(this.conversationForm.cQuestions[this.qNum-1].secondIntervene.iFileName)
            return false; // 阻止自动上传
            // 可以在这里设置一些其他的参数
        },
        beforeUpload1(file) {
            this.conversationForm.cQuestions[this.qNum-1].firstIntervene.iFileName=file
            console.log("before")
            console.log(this.conversationForm.cQuestions[this.qNum-1].firstIntervene.iFileName)
            return false; // 阻止自动上传
            // 可以在这里设置一些其他的参数
        },
        // 上传成功的回调
        uploadAudio() {
            if (this.file) {
                // 执行上传文件的逻辑，可以调用后端接口或其他处理方式
                // 在这里可以使用 this.file 进行操作，例如上传到服务器等
                console.log('上传的音频文件:', this.file);
            } else {
                console.log('请选择要上传的音频文件');
            }
        },
        handleSuccess(response, file, fileList) {
            console.log(file)
            console.log(2)
            this.file=file
            this.$message.success('上传成功');
            // 可以在这里处理上传成功后的操作
        },
        // 上传失败的回调
        handleError(error, file, fileList) {
            console.log(file)
            console.log(1)
            this.$message.error('上传失败');
            // 可以在这里处理上传失败后的操作

        },
    },
    computed: {
        ...mapState(['paperminlist','conversationData','conversationList','interList']),
        dialogTitle() {
            if(this.displayType == "view") {
                return "查看详情"
            } else if (this.displayType == "edit") {
                return "修改对话"
            } else if (this.displayType == "add") {
                return "添加对话"
            } else {
                return ""
            }
        }}
}
</script>

<style>
.el-collapse-item__header {
    color: #409EFF;
}
</style>
