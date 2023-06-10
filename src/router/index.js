import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/Login')
  },
  {
    path: '/home',
    component: () => import('@/components/Home'),
    children: [
      {
        path: '/examination',
        component: () => import('@/views/ExaminationPage')
      },
      {
        path: '/question',
        component: () => import('@/views/QuestionPage')
      },
      {
        path: '/paperview',
        component: () => import('@/views/PaperView.vue')
      },
      {
        path: '/score',
        component: () => import('@/views/ScorePage')
      },
      {
        path: '/class',
        name:'class',
        component: () => import('@/views/ClassPage')
      },
      {
        path: '/class/student',
        // name:'student',
        component: () => import('@/views/StudentPage')
      },

      {
        path: '/feedback',
        component: () => import('@/views/FeedbackPage')
      },
      {
        path: '/student/examination',
        component: () => import('@/views/StudentExaminationInfo')
      },
      {
        path: '/student/my/examination',
        component: () => import('@/views/MyExaminationPage')
      },
      {
        path: '/student/examinationId/:eId/studentId/:sId',
        component: () => import('@/views/ExecuteExaminationPage')
      },
      {
        path: '/student/personalCenter',
        component: () => import('@/views/PersonalCenter')
      },
      {
        path: '/student/passwordChange',
        component: () => import('@/views/PasswordChange')
      },
      {
        path:'/student/add',
        component:()=>import('@/views/Studentadd.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
