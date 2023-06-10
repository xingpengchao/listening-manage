import { createStore } from 'vuex'
// import store from './store'
import { HttpManager } from '../api/index'
import {CODE} from "@/resources/common";
import {ElMessage} from "element-plus";
import {resolve} from "chart.js/helpers";

export default createStore({
  state: {
    collapse: false,
    loginStatus: false,
    user: {
      id: "",
      name: "",
      number: ""
    },
    systemName: {
      index: "听力动态评估干预系统",
      student: "听力动态评估干预系统学生端",
      teacher: "听力动态评估干预系统教师端"
    },
    studentList: [],
    classList: [],
    studentData: {},
    examinationList: [],
    examinationData: {},
    conversationList: [],
    conversationData: {}, //编辑对话，查看对话
    paperminlist:[],
    interList:[],
    paperList: [],
    examinationScoreList: [],
    scoreDetail: [],
    feedbackList: [],
    feedbackReportData: [], // 调查问卷的内容，教师端显示用
    fQuestionList:[], // 存的是调查问卷的问题，学生端显示用
    studentExaminationList: [] ,    //学生端显示用
    currentStudentExamination:{ //当前学生考试使用的试卷
      currentStudentParer:[],//试卷的总体信息
      currentConversationList:[], //当前学生考试使用试卷的大题
      currentPaperMinList:[],//当前学生考试试卷的小题题
      currentMinInterveneList:[],//干预
    },
    feedbackMessageList: [],
    personalMessageList: [], //个人中心的资料
    paperViewList:[],//试卷视图
    testPaperList:[],//所有考试列表
  },
  getters: {
  },
  mutations: {
    updateCurrentStudentExaminationPaper(state,newValue){
      state.currentStudentExamination.currentStudentParer = newValue
    },
    updateCurrentStudentExaminationConversationList(state,newValue){
      state.currentStudentExamination.currentConversationList = newValue
    },
    updateCurrentStudentExaminationMinInterveneList(state,newValue){
      state.currentStudentExamination.currentMinInterveneList.push(newValue)
    },
    updateCurrentStudentExaminationPaperMinList(state,newValue){
      state.currentStudentExamination.currentPaperMinList.push(newValue)
    },
    updateTestPaper(state,newValue){
      state.testPaperList = newValue
    },
    updatepaperminlist(state,newValue){
      state.paperminlist=newValue
    },
    updateInterList(state,newValue){
      state.interList=newValue
    },
    updateUser(state, newValue) {
      state.user = newValue
    },
    updateCollapse(state, newValue) {
      state.collapse = newValue
    },
    updateStudentList(state, newValue) {
      state.studentList = newValue
    },
    updateClassList(state, newValue) {
      state.classList = newValue
    },
    updateStudentData(state, newValue) {
      state.studentData = newValue
    },
    updateExaminationList(state, newValue) {
      state.examinationList = newValue
    },
    updateExaminationData(state, newValue) {
      state.examinationData = newValue
    },
    updateConversationList(state, newValue) {
      state.conversationList = newValue
    },
    updateConversationData(state, newValue) {
      state.conversationData = newValue
    },
    updatePaperList(state, newValue) {
      state.paperList = newValue

    },
    updateExaminationScoreList(state, newValue) {
      state.examinationScoreList = newValue
    },
    updateScoreDetail(state, newValue) {
      state.scoreDetail = newValue
    },
    updateFeedbackList(state, newValue) {
      state.feedbackList = newValue
    },
    updateFeedbackReportData(state, newValue) {
      state.feedbackReportData = newValue
    },
    updateLoginStatus(state, newValue) {
      state.loginStatus = newValue
    },
    updateFQuestionList(state, newValue) {
      state.fQuestionList = newValue
    },
    updateStudentExaminationList(state, newValue) {
      state.studentExaminationList = newValue
    },
    updateFeedbackMessageList(state, newValue) {
      state.feedbackMessageList = newValue
    },
    updatePersonalMessageList(state, newValue) {
      state.personalMessageList = newValue
    },
    updatePaperViewList(state, newValue) {
      state.paperViewList = newValue
    },
  },
  actions: {
    getStudentList(context, payload) {
      return new Promise(async (resolve, reject) => {
        const requestParams = {
          // pageNum: (payload.currentPage - 1) * payload.pageSize,
          pageNum: '0',
          pageSize: payload.pageSize,
          studentClass: payload.className
        }
        console.log(requestParams)
        await HttpManager.getStudents(requestParams)
            .then(res => {
              console.log("08")
              console.log(res)
              if (res.code == CODE.OK_200) {
                resolve(res)
                // console.log(res.hashmap.hasNext)
                context.commit('updateStudentList', res.hashmap.Students)
              } else {
                console.log(res)
                reject('分页查询学生失败')
              }
            }).catch((error) => {
              console.log("0808")
              reject(error)
            })
      })
      // 异步请求后台临时假数据
      // const mockResponseData = [{
      //   id: 1,
      //   name: 'Tom1',
      //   number: '04183110',
      //    filled: 0,  //个人资料是否已填 0表示没有填（不能参加考试） 1表示已经填了（可以参加考试）
      // }, {
    },
    getTestPaperList(context) {
      return new Promise(async (resolve, reject) => {
        await HttpManager.getTestPaper()
            .then((res) => {
              if (res.code == CODE.OK_200) {
                resolve(res)
                context.commit('updateTestPaper', res.hashmap.testingPaperView)
                console.log(res.hashmap.testingPaperView)
              } else {
                reject('分页查询考试列表失败')
              }
            }).catch((error) => {
              reject(error)
            })
      })
    },
    getClassList(context, payload) {
      return new Promise(async (resolve, reject) => {
        const requestParams = {
          pageNum: (payload.currentPage - 1) * payload.pageSize,
          pageSize: payload.pageSize,
        }
        await HttpManager.getStudentClassPage(requestParams)
            .then((res) => {
              if (res.code == CODE.OK_200) {
                resolve(res)
                context.commit('updateClassList', res.hashmap.StudentsClass)
                console.log(res.hashmap.StudentClass.hasnext)
              } else {
                reject('分页查询班级失败')
              }
            }).catch((error) => {
              reject(error)
            })
      })
    },
    getStudentById(context, params) {
      HttpManager.getStudentById(params).then((res) => {
            if (res.code == CODE.OK_200) {
              console.log(res)
              context.commit("updateStudentData", res)
            } else {
              ElMessage.error("查询不到");
              console.log("这块错了")
            }
          }
      )
    },
    getExaminationList(context, payload) {

      console.log(payload)
      // 异步请求后台临时假数据
      const mockResponseData = [{
        id: 1,
        examinationName: "test1",
        startTime: "2022/12/01 21:49:13",
        endTime: "2022/12/03 21:49:13",
        // 0表示未开始， 1表示进行中， 2表示已结束
        examinationState: 0,
        pId: 1,
        pTypes: '0'
      }, {
        id: 2,
        examinationName: "test2",
        startTime: "2022/12/01 21:49:13",
        endTime: "2022/12/03 21:49:13",
        // 0表示未开始， 1表示进行中， 2表示已结束
        examinationState: 1,
        pId: 1,
        pTypes: '0'
      }, {
        id: 3,
        examinationName: "test3",
        startTime: "2022/12/01 21:49:13",
        endTime: "2022/12/03 21:49:13",
        // 0表示未开始， 1表示进行中， 2表示已结束
        examinationState: 2,
        pId: 1,
        pTypes: '1'
      }, {
        id: 4,
        examinationName: "test4",
        startTime: "2022/12/01 21:49:13",
        endTime: "2022/12/03 21:49:13",
        // 0表示未开始， 1表示进行中， 2表示已结束
        examinationState: 0,
        pId: 1
      }, {
        id: 5,
        examinationName: "test5",
        startTime: "2022/12/01 21:49:13",
        endTime: "2022/12/03 21:49:13",
        // 0表示未开始， 1表示进行中， 2表示已结束
        examinationState: 1,
        pId: 1,
        pTypes: '1'
      }, {
        id: 6,
        examinationName: "test6",
        startTime: "2022/12/01 21:49:13",
        endTime: "2022/12/03 21:49:13",
        // 0表示未开始， 1表示进行中， 2表示已结束
        examinationState: 2,
        pId: 1,
        pTypes: '1'
      },
        {
          id: 7,
          examinationName: "test7",
          startTime: "2022/12/01 21:49:13",
          endTime: "2022/12/03 21:49:13",
          // 0表示未开始， 1表示进行中， 2表示已结束
          examinationState: 0,
          pId: 1,
          pTypes: '1'
        }, {
          id: 8,
          examinationName: "test8",
          startTime: "2022/12/01 21:49:13",
          endTime: "2022/12/03 21:49:13",
          // 0表示未开始， 1表示进行中， 2表示已结束
          examinationState: 1,
          pId: 1,
          pTypes: '1'
        }, {
          id: 9,
          examinationName: "test9",
          startTime: "2022/12/01 21:49:13",
          endTime: "2022/12/03 21:49:13",
          // 0表示未开始， 1表示进行中， 2表示已结束
          examinationState: 2,
          pId: 1,
          pTypes: '2'
        }, {
          id: 10,
          examinationName: "test10",
          startTime: "2022/12/01 21:49:13",
          endTime: "2022/12/03 21:49:13",
          // 0表示未开始， 1表示进行中， 2表示已结束
          examinationState: 0,
          pId: 1,
          pTypes: '2'
        }, {
          id: 11,
          examinationName: "test11",
          startTime: "2022/12/01 21:49:13",
          endTime: "2022/12/03 21:49:13",
          // 0表示未开始， 1表示进行中， 2表示已结束
          examinationState: 1,
          pId: 1,
          pTypes: '2'
        }, {
          id: 12,
          examinationName: "test12",
          startTime: "2022/12/01 21:49:13",
          endTime: "2022/12/03 21:49:13",
          // 0表示未开始， 1表示进行中， 2表示已结束
          examinationState: 2,
          pId: 1,
          pTypes: '2'
        }]
      // 请求到数据后保存在store中
      context.commit('updateExaminationList', mockResponseData)
    },
    getExaminationById({commit, state}, payload) {
      const resData = state.examinationList.find(item => {
        return item.id == payload.id
      })
      console.log(state.examinationData)
      commit("updateExaminationData", resData)
    },
    async getCurrentStudentExamination(context, payload){
      console.log(context.state.studentExaminationList)
      console.log(payload.eId)
      const resData = context.state.studentExaminationList
          .find(item => {
            return item.num === payload.eId
          })
      console.log(resData.num)
      if(resData){
        context.commit("updateCurrentStudentExaminationPaper", resData)
        console.log(context.state.currentStudentExamination)
        const param1={
          num:resData.num
        }
        //获取考试试卷的大题
        await HttpManager.getConversationList(param1)
            .then((res) => {
              console.log(res)
              console.log(res)
              console.log(resData.num)
              if (res.code === CODE.OK_200) {
                context.commit('updateCurrentStudentExaminationConversationList', res.hashmap.paper)
                console.log(res.hashmap.paper)
              } else {
                ElMessage.warning("出错了")
              }
            })
        for (var i in context.state.currentStudentExamination.currentConversationList){
          var param2={
            num:context.state.currentStudentExamination.currentConversationList[i].num,
            title_num:context.state.currentStudentExamination.currentConversationList[i].title_num}
          console.log(param2)
          await HttpManager.getPaperMinList(param2) .then(async (res) => {
            if (res.code === CODE.OK_200) {
              if (res.hashmap.paperMinList.length !== 0)
                context.commit('updateCurrentStudentExaminationPaperMinList', res.hashmap.paperMinList);
              for (var j = 0; j < res.hashmap.paperMinList.length;j++) {
                var param3 = {
                  num: context.state.currentStudentExamination.currentConversationList[i].num,
                  title_num: context.state.currentStudentExamination.currentConversationList[i].title_num,
                  title_min_num: res.hashmap.paperMinList[j].title_min_num
                }
                console.log(param3)
                await HttpManager.getPaperInterveneList(param3).then((res) => {
                  if(res.code===CODE.OK_200){
                    if(res.hashmap.paperIntervene.length!==0)
                      context.commit("updateCurrentStudentExaminationMinInterveneList",res.hashmap.paperIntervene)
                  }
                  else {
                    ElMessage.warning("获取干预出错了")
                  }
                })
              }
            } else {
              ElMessage.warning("获取小题出错了")
            }
          })


        }
        console.log(context.state.currentStudentExamination)


        //获取考试试卷的干预
        const requestParams = {
          paperNum:resData.num,//试卷号
          //titleNum:context.state.currentStudentExamination.currentConversationList.titleNum,//大题号
          // isOnLine:,//是否在线播放
        }
      }else{
        console.log('为找到该试卷')
      }
    },
    async getConversationList(context, payload) {
      await HttpManager.getConversationList(payload)
          .then((res) => {
            if (res.code === CODE.OK_200) {
              context.commit('updateConversationList', res.hashmap.paper)
              console.log(res.hashmap.paper)
            } else {
              ElMessage.warning("出错了")
            }
          })
    },
    //获取
    getInterList(context,payload){
      return new Promise(async (resolve,reject)=>{
        await HttpManager.getPaperInterveneList(payload).then((res)=>{
              if(res.code===CODE.OK_200){
                resolve(res)
                context.commit("updateInterList",res.hashmap.paperIntervene)
              }
              else {
                ElMessage.warning("出错啦")
                reject("获取干预列表出错")
              }
            }
        ).catch((error) => {
          console.log("0808")
          reject(error)
        })
      })
    },


    getPaperMinList(context, payload) {
      return new Promise(async (resolve, reject) => {
        await HttpManager.getPaperMinList(payload).then((res) => {
              if (res.code === CODE.OK_200) {
                resolve(res)
                context.commit('updatepaperminlist', res.hashmap.paperMinList)
                console.log(res.hashmap.paperMinList)
              } else {
                ElMessage.warning("出错啦")
                reject("获取小题列表失败")
              }
            }
        ).catch((error) => {
          console.log("0808")
          reject(error)
        })
      })
    },
    // 请求到数据后保存在store中
    getConversationByCId({commit, state}, payload) {
      const resData = state.conversationList.find(item => {
        return item.title_num == payload.title_num
      })
      console.log(resData)

      commit("updateConversationData", resData)
    },
    getConversationByCIds({state}, payload) {
      return new Promise((resolve, reject) => {
        const cIds = payload
        if (cIds && cIds.length > 0) {
          const conversations = cIds.map((cId) => {
            const conversationObj = state.conversationList.find((element) => (element.cId == cId))
            if (conversationObj) {
              return conversationObj
            }
          })
          resolve(conversations)
        } else {
          reject('您没有选择对话')
        }
      })
    },
    //获取试卷视图
    getPaperList(context,payload) {
      HttpManager.getPaperViews()
          .then((res) => {
        const mockResponseData = res.hashmap.PaperView
        context.commit('updatePaperList', mockResponseData)
      })
    },
    getExaminationScoreList(context, payload) {
      console.log(payload)
      // 异步请求后台临时假数据
      const mockResponseData = [
        {
          eId: 1,
          sId: 1,
          name: 'xiaoli',
          number: '04184061',
          actualScore: 25,
          interveneScore: 12,
          progressScore: 7,
          LPS: 5.6,
          interveneTimes: 12
        },
        {
          eId: 1,
          sId: 2,
          name: 'xiaoli',
          number: '04184061',
          actualScore: 25,
          interveneScore: 12,
          progressScore: 7,
          LPS: 5.6,
          interveneTimes: 12
        },
        {
          eId: 1,
          sId: 3,
          name: 'xiaoli',
          number: '04184061',
          actualScore: 25,
          interveneScore: 12,
          progressScore: 7,
          LPS: 5.6,
          interveneTimes: 12
        },
        {
          eId: 1,
          sId: 4,
          name: 'xiaoli',
          number: '04184061',
          actualScore: 25,
          interveneScore: 12,
          progressScore: 7,
          LPS: 5.6,
          interveneTimes: 12
        },
        {
          eId: 1,
          sId: 5,
          name: 'xiaoli',
          number: '04184061',
          actualScore: 25,
          interveneScore: 12,
          progressScore: 7,
          LPS: 5.6,
          interveneTimes: 12
        },
        {
          eId: 1,
          sId: 6,
          name: 'xiaoli',
          number: '04184061',
          actualScore: 25,
          interveneScore: 12,
          progressScore: 7,
          LPS: 5.6,
          interveneTimes: 12
        },
        {
          eId: 1,
          sId: 7,
          name: 'xiaoli',
          number: '04184061',
          actualScore: 25,
          interveneScore: 12,
          progressScore: 7,
          LPS: 5.6,
          interveneTimes: 12
        },
        {
          eId: 1,
          sId: 8,
          name: 'xiaoli',
          number: '04184061',
          actualScore: 25,
          interveneScore: 12,
          progressScore: 7,
          LPS: 5.6,
          interveneTimes: 12
        },
        {
          eId: 1,
          sId: 9,
          name: 'xiaoli',
          number: '04184061',
          actualScore: 25,
          interveneScore: 12,
          progressScore: 7,
          LPS: 5.6,
          interveneTimes: 12
        }
      ]
      // 请求到数据后保存在store中
      context.commit('updateExaminationScoreList', mockResponseData)
    },
    getScoreDetailByEIdAndSId(context, payload) {
      console.log(payload)
      const mockResponseData = [
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 1,
          actualScore: 3,
          interveneScore: 4,
          interveneTimes: 2,
          testTime: '4500ms',
          answerTime: '5000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 2,
          actualScore: 5,
          interveneScore: 0,
          interveneTimes: 0,
          testTime: '0ms',
          answerTime: '3000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 3,
          actualScore: 3,
          interveneScore: 4,
          interveneTimes: 2,
          testTime: '4500ms',
          answerTime: '5000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 4,
          actualScore: 5,
          interveneScore: 0,
          interveneTimes: 0,
          testTime: '0ms',
          answerTime: '3000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 5,
          actualScore: 3,
          interveneScore: 4,
          interveneTimes: 2,
          testTime: '4500ms',
          answerTime: '5000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 6,
          actualScore: 5,
          interveneScore: 0,
          interveneTimes: 0,
          testTime: '0ms',
          answerTime: '3000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 7,
          actualScore: 3,
          interveneScore: 4,
          interveneTimes: 2,
          testTime: '4500ms',
          answerTime: '5000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 8,
          actualScore: 5,
          interveneScore: 0,
          interveneTimes: 0,
          testTime: '0ms',
          answerTime: '3000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 9,
          actualScore: 3,
          interveneScore: 4,
          interveneTimes: 2,
          testTime: '4500ms',
          answerTime: '5000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 10,
          actualScore: 5,
          interveneScore: 0,
          interveneTimes: 0,
          testTime: '0ms',
          answerTime: '3000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 11,
          actualScore: 3,
          interveneScore: 4,
          interveneTimes: 2,
          testTime: '4500ms',
          answerTime: '5000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 12,
          actualScore: 5,
          interveneScore: 0,
          interveneTimes: 0,
          testTime: '0ms',
          answerTime: '3000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 13,
          actualScore: 3,
          interveneScore: 4,
          interveneTimes: 2,
          testTime: '4500ms',
          answerTime: '5000ms'
        },
        {
          scoreId: 1,
          eId: 1,
          sId: 1,
          qId: 14,
          actualScore: 5,
          interveneScore: 0,
          interveneTimes: 0,
          testTime: '0ms',
          answerTime: '3000ms'
        },
      ]
      context.commit('updateScoreDetail', mockResponseData)
    },
    getFeedbackList(context, payload) {
      console.log(payload)
      const mockResponseData = [
        {
          sId: 1,
          name: 'Tom1',
          number: '04183114',
          submitTime: '2022/12/01 21:49:13',
          flag: 1
        },
        {
          sId: 1,
          name: 'Tom1',
          number: '04183114',
          submitTime: '2022/12/01 21:49:13',
          flag: 2
        },
        {
          sId: 1,
          name: 'Tom1',
          number: '04183114',
          submitTime: '2022/12/01 21:49:13',
          flag: 1
        },
        {
          sId: 1,
          name: 'Tom1',
          number: '04183114',
          submitTime: '2022/12/01 21:49:13',
          flag: 2
        },
        {
          sId: 1,
          name: 'Tom1',
          number: '04183114',
          submitTime: '2022/12/01 21:49:13',
          flag: 1
        },
        {
          sId: 1,
          name: 'Tom1',
          number: '04183114',
          submitTime: '2022/12/01 21:49:13',
          flag: 2
        },
        {
          sId: 1,
          name: 'Tom1',
          number: '04183114',
          submitTime: '2022/12/01 21:49:13',
          flag: 1
        },
        {
          sId: 1,
          name: 'Tom1',
          number: '04183114',
          submitTime: '2022/12/01 21:49:13',
          flag: 2
        },
        {
          sId: 1,
          name: 'Tom1',
          number: '04183114',
          submitTime: '2022/12/01 21:49:13',
          flag: 1
        },
        {
          sId: 1,
          name: 'Tom1',
          number: '04183114',
          submitTime: '2022/12/01 21:49:13',
          flag: 2
        },
        {
          sId: 1,
          name: 'Tom1',
          number: '04183114',
          submitTime: '2022/12/01 21:49:13',
          flag: 1
        },
        {
          sId: 1,
          name: 'Tom1',
          number: '04183114',
          submitTime: '2022/12/01 21:49:13',
          flag: 2
        },
      ]
      context.commit('updateFeedbackList', mockResponseData)
    },
    getFeedbackReportDataBySId(context, payload) {
      console.log(payload)
      const mockResponseData = [
        {
          fqId: 1,
          fQuestion: 'The C-DA system is preferable to the traditional listening tasks.',
          answer: '1'
        },
        {
          fqId: 2,
          fQuestion: 'The hints/helps provided by the C-DA system were beneficial to me.',
          answer: '2'
        },
        {
          fqId: 3,
          fQuestion: 'I would have preferred a teacher assistant to help me with the problems.',
          answer: '3'
        },
        {
          fqId: 4,
          fQuestion: 'I would have scored better than I try alone my listening tasks.',
          answer: '4'
        },
        {
          fqId: 5,
          fQuestion: 'I was able to understand the material well through this C-DA system.',
          answer: '5'
        },
        {
          fqId: 6,
          fQuestion: 'I value the C-DA system as an effective learning experience.',
          answer: '1'
        },
        {
          fqId: 7,
          fQuestion: 'The hints during exam stimulated me to activate what I know.',
          answer: '2'
        },
        {
          fqId: 8,
          fQuestion: 'Overall, C-DA system helped me developed my listening skills in traditional tasks.',
          answer: '3'
        },
      ]
      context.commit('updateFeedbackReportData', mockResponseData)
    },
    getFQuestionList(context, payload) {
      console.log(payload)
      const mockResponseData = [
        {
          fqId: 1,
          fQuestion: 'The C-DA system is preferable to the traditional listening tasks.'
        },
        {
          fqId: 2,
          fQuestion: 'The hints/helps provided by the C-DA system were beneficial to me.'
        },
        {
          fqId: 3,
          fQuestion: 'I would have preferred a teacher assistant to help me with the problems.'
        },
        {
          fqId: 4,
          fQuestion: 'I would have scored better than I try alone my listening tasks.'
        },
        {
          fqId: 5,
          fQuestion: 'I was able to understand the material well through this C-DA system.'
        },
        {
          fqId: 6,
          fQuestion: 'I value the C-DA system as an effective learning experience.'
        },
        {
          fqId: 7,
          fQuestion: 'The hints during exam stimulated me to activate what I know.'
        },
        {
          fqId: 8,
          fQuestion: 'Overall, C-DA system helped me developed my listening skills in traditional tasks.'
        },
      ]
      context.commit('updateFQuestionList', mockResponseData)
    },
    //有问题，好像可以不要 getTestingPaperViewList 已经代替了
    getExaminationListBySId(context, payload) {
      return new Promise(async (resolve, reject) => {
        const requestParams = {
          studentnum: payload.studentNum
        }
        await HttpManager.getTestingPaperViewList(requestParams)
            .then((res) => {
              if (res.code == CODE.OK_200) {
                resolve(res)
                context.commit('updateStudentExaminationList', res.hashmap.testingPaperView)
                console.log(res.hashmap)
              } else {
                reject('分页查询失败')
              }
            }).catch((error) => {
              reject(error)
            })
      })
      // 请求到数据后保存在store中

    },
    getFeedbackMessageListByEIdAndSId(context, payload) {
      console.log(payload)
      const mockResponseData = [
        {
          cId: 1,
          cName: "1",
          cQuestions: [
            {
              qId: 1,
              question: "What does the woman imply about the people who work in the payroll office?",
              questionThought: '我是答题思路1',
              hintSatisfaction: '我是提示的满意度1'
            },
            {
              qId: 2,
              question: "What will the student probably need to do to get paid?",
              questionThought: '我是答题思路2',
              hintSatisfaction: '我是提示的满意度2'
            },
            {
              qId: 3,
              question: "How does the student's attitude change during the conversation? _________",
              questionThought: '我是答题思路3',
              hintSatisfaction: '我是提示的满意度4'
            },
          ],
        },
        {
          cId: 2,
          cName: "2",
          cQuestions: [
            {
              qId: 4,
              question: "What are the speakers mainly discussing?",
              questionThought: '我是答题思路1',
              hintSatisfaction: '我是提示的满意度1'
            },
            {
              qId: 5,
              question: "How does the man probably feel at the end of the conversation?",
              questionThought: '我是答题思路2',
              hintSatisfaction: '我是提示的满意度2'
            },
            {
              qId: 6,
              question: "Listen again to part of the conversation. Then answer the question.Why does the woman say this:",
              questionThought: '我是答题思路3',
              hintSatisfaction: '我是提示的满意度4'
            },
          ],
        },
        {
          cId: 3,
          cName: "3",
          cQuestions: [
            {
              qId: 7,
              question: "Why does the professor talk about philosophy? ________",
              questionThought: '我是答题思路1',
              hintSatisfaction: '我是提示的满意度1'
            },
          ],
        },
        {
          cId: 4,
          cName: "4",
          cQuestions: [
            {
              qId: 8,
              question: "What does the employee mean when he says this: ___________",
              questionThought: '我是答题思路1',
              hintSatisfaction: '我是提示的满意度1'
            },
          ],
        },
      ]
      context.commit('updateFeedbackMessageList', mockResponseData)
    },
    getPersonalMessageListByStudentNumber(context, payload) {
      HttpManager.getPersonnalInfoById(payload).then((res) => {
            if (res.data == CODE.OK_200) {
              console.log(res)
              return res
              context.commit("updatePersonalMessageList", res)
            } else {
              ElMessage.error("查询不到");
              console.log("这块错了")
            }
          }
      )
    },
    getPaperViewList(context, payload) {
      HttpManager.getPaperViews()
          .then((res) => {
                if (res.data == CODE.OK_200) {
                  console.log(res)
                  return res
                  context.commit("updatePaperViewList", res)
                } else {
                  ElMessage.error("查询不到试卷视图");
                  console.log("这块错了")
                }
              }
          )
    },
  },
  modules: {
  }
})
