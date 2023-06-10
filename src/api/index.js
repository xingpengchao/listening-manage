import {get, post,deletesWrapper} from './http'
import axios from "axios";

const HttpManager = {
  // 是否登录成功
  // 是否登录成功
  getLoginStatus: (params) =>post(`/login`, params),

  //添加单个学生
  addSingleStudent: (params) => post('/student/add', params),

  //编辑单个学生
  editSingleStudent: (params) => post(`/student/update`, params),

  //分页查询学生数据（普通查询和模糊查询都可用）
  getStudents: (params) =>post(`/student/page`,params),

  //删除单个学生
  deleteStudent: (sid) => post(`/student/delete?sid=${sid}`),

  //批量删除单个学生
  batchDeleteStudent: (ids) => deletesWrapper(`/student/delete/batch?ids=${ids}`),


  //接下来是学生详细信息，目前还未使用
  //更新个人信息
  editStudentInfo:(params)=>post('/personalInfo/post',params),

  //获取所有个人信息

  getStudentAll:(params)=>get('/personalInfo/getAll',params),
  getPersonnalInfoById:(params)=>get('student/getByNum',params),

  //添加个人信息
  addStudentInfo:(params)=>post('/personalInfo/put',params),

  //根据学号查找学生
  getStudentById:(params)=>get('/personalInfo/getById',params),

//添加班级
  setClasses:(params) =>post('/student/setStudentClass',params),
//更新班级
  updateStudentClass:(param) =>post('/student/updateStudentClass',param),
  //删除班级
  deleteStudentClass:(param)=>post('/student/deleteStudentClass',param),

  //获取classpage
  getStudentClassPage:(param)=>post('/student/getStudentClassPage',param),
  //这部分是对考试的控制

  //添加试卷视图
  addPaperView:(params)=>post('/paper/addPaperView',params),

  //添加或更新试卷
  addPaper:(params)=>post('/paper/postPaper',params),

  //获取所有对话
  getConversationList:(params)=>post('/paper/getPaperList',params),

//   添加或更新试卷试卷干预信息
  addPaperIntervence:(params)=>post('/paper/postPaperIntervene',params),

//   删除试卷 根据试卷号删除一套试卷
  deletePaper:(params)=>post('/paper/deletePaper',params),

//   添加考试试卷
  addTestPaper:(params)=>post('/paper/addTestPaper',params),
//   添加听力音频
  addPaperListen:(params)=>post('/paper/addPaperListenFile',params),

//   获取大题听力音频
  getPaperListen:(params)=>post('/paper/getListenFile ',params),

// 添加干预听力音频
  addPaperIntervenceListen:(params)=>post('/paper/addPaperInterListenFile',params),
//   获取干预听力音频
  getPaperIntervenceListen:(params)=>post('/paper/getListenInterFile',params),


  getpapermin:(params)=>post('/paper/getPaperMin',params),

  postpapermin:(params)=>post('paper/PostPaperMin',params),

  //根据num和大题号获取所有的小题
  getPaperMinList:(params)=>post('paper/getPaperMinList',params),


  postPaperIntervene:(params)=>post('/paper/postPaperIntervene',params),


  getPaperInterveneList:(params)=>post('/paper/getPaperInterveneList',params),
  ///接下来是学生考试是获取考试数据
  //获取所有试卷视图
  getPaperViews:(params)=>post('/paper/getPaperView',params),

  //获取正在考试中的试卷名称
  getTestingPaperName:(params)=>post('/stuGetMsg/getTestingPapers',params),

//返回学生对应的考试列表
  getTestingPaperViewList:(params)=>post('/stuGetPaper/getTestingPaperViewList',params),

  //获取正在考试中的试卷视图
  getTestingPaperview:(params)=>post('/stuGetMsg/getTestingPaperView',params),

  //获取所有考试列表
  getTestPaper:(params) =>post('/paper/getTestPaper',params),

  //获取考试试卷
  getTestingPaper:(params)=>post('/stuGetMsg/getTestingPaper',params),


  //获取干预试卷
  getTestingPaperIntervene:(params)=>post('/stuGetMsg/getTestingPaperIntervene',params),



}



export {HttpManager}
