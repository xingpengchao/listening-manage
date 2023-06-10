<template>
    <div>
        <el-dialog v-model="examinationDialogDisplay" :title="dialogTitle" align-center @close="examinationDialogClose">
            <div style="height: 440px">
                <el-scrollbar max-height="440px" style="padding-right: 10px" >
                    <el-form
                            :model="examinationForm"
                            label-position="left"
                            label-width="82px"
                            :disabled="!Boolean(paperId)"
                            style="width: 100%">

                        <el-form-item label="试卷名称">
                            <el-input v-model="examinationForm.name" />

                        </el-form-item>
                        <el-form-item label="试卷介绍">
                            <el-input v-model="examinationForm.introduce" />
                        </el-form-item>
                        <el-form-item label="试题总数">
                            <el-input v-model="examinationForm.total" />
                        </el-form-item>
                        <el-form-item label="测试类型">
                            <el-radio-group v-model="examinationForm.isProxy" class="ml-5" @change="paperTypesChange">

                                <el-radio label="false" size="large">非加强测</el-radio>
                                <el-radio label="true" size="large">加强测</el-radio>
                                <!--                <el-radio label="2" size="large">后测</el-radio>-->
                            </el-radio-group>
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
        paperId: {
            type:  Number,
            default: 0
        },
        paperName:{
            type: String,
            default:''
        },
        proxy:{
            type:  Number,
            default: 0
        },
        introduce:{
            type: String,
            default:''
        },
        total:{
            type:Number,
            default:0
        }


    },
    watch: {
        isShowDialog: {
            handler(newValue, oldValue) {
                this.examinationDialogDisplay = newValue
            },
            deep: true
        },
        paperName:{
            handler(newValue,oldValue){
                this.examinationForm.name=newValue
            }
        },
        proxy:{
            handler(newValue,oldValue){
                this.examinationForm.isProxy=newValue
            }
        },
        total:{
            handler(newValue,oldValue){
                this.examinationForm.total=newValue
            }
        },
        introduce:{
            handler(newValue,oldValue){
                this.examinationForm.introduce=newValue
            }
        },

        paperId: {//判断是查看还是添加
            handler(newValue, oldValue) {
                if (newValue<=this.paperList[this.paperList.length-1].num) {
                    this.examinationForm.num=newValue
                }
                else {
                    this.examinationForm = {
                        num: this.paperList[this.paperList.length-1].num+1,//试卷编号
                        name: '',//试卷名称
                        total: null,//试卷总数
                        introduce:'',//试卷介绍
                        isProxy:false,//是否加强测
                        // pTypes: '0',  //试卷的类型，前测0 中间测1 后测2
                    }
                }
            },
            deep: true
        }
    },
    data() {
        return {
            examinationDialogDisplay: false,
            // 当前画面选择对话下拉框数据
            examinationForm: {
                num:this.paperId,//试卷编号
                name:this.paperName,//试卷名称
                total:this.total,//试卷总数
                introduce:this.introduce,//试卷介绍
                isProxy:this.proxy,//是否加强测
                // pTypes: '0',  //试卷的类型，前测0 中间测1 后测2
            },
        }
    },
    created() {

    },
    methods: {
        ...mapActions([ 'getPaperList']),
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


        clickCancelButton() {
            this.examinationDialogDisplay = false
            console.log(this.examinationForm)
            this.$emit("closeDialog", this.examinationDialogDisplay)

        },
        clickConfirmButton() {
            const params = {
                num: this.examinationForm.num,
                name: this.examinationForm.name,
                total:this.examinationForm.total,
                introduce:this.examinationForm.introduce,
                isProxy:this.examinationForm.isProxy
                // pTypes: '0',  //试卷的类型，前测0 中间测1 后测2
            }
            console.log(params)
            HttpManager.addPaperView(params)
                .then((res) =>{
                    console.log(res.code)
                    if(res.code == CODE.OK_200){
                        ElMessage.success(res.msg)
                        this.examinationDialogDisplay = false
                        this.$emit("closeDialog", this.examinationDialogDisplay)
                    }else {
                        ElMessage.error(res.msg)
                        ElMessage.error("这块错了1 ")
                    }
                }).catch((error) => {
                ElMessage.error('服务器错误')
            })

        },
        examinationDialogClose() {
            this.examinationDialogDisplay = false
            this.$emit("closeDialog", this.examinationDialogDisplay)
        },
        getPaperViewData(id) {
            for (const i in this.getPaperList) {
                if(i.num===id){
                    this.examinationForm.name=i.name
                    this.examinationForm.introduce=i.introduce
                    this.examinationForm.total=i.total
                    this.examinationForm.isProxy=i.proxy
                }
                else{
                    ElMessage.warning("这份试卷坏了，建议删掉")
                }
            }
        }
    },
    computed: {
        ...mapState([ 'paperList']),
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
