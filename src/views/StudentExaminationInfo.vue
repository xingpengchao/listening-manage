<template>
  <div class="container">
    <el-table
        :data="currentTableData"
        style="width: 100%"
        max-height="481"
        border >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="考试名称" width="200" />
      <el-table-column prop="startTime" label="开始时间" width="200" >
<!--          使用作用域插槽来自定义渲染内容-->
          <template v-slot="scope">
              {{ formatDate(scope.row.startTime) }}
          </template>

      </el-table-column>
      <el-table-column prop="finishTime" label="结束时间" width="200" />
      <el-table-column
          prop="examinationState"
          label="状态"
          width="81"
          filter-placement="bottom-end" >
        <template v-slot="scope">
          <!-- "success", "info", "warning", "danger", ""-->
          <el-tag
              :type="getTagType(scope)"
              disable-transitions>{{getTagValue(scope)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template v-slot="scope">
          <el-button @click="clickStartExaminationButton(scope.row.num)">开始考试</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        class="pagination"
        background
        layout="total, prev, pager, next"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="this.studentExaminationList.length"
        @current-change="handleCurrentChange" >
    </el-pagination>
  </div>
</template>

<script>
import {mapActions, mapState} from "vuex";
import {provide} from "vue";
import {HttpManager} from "@/api";

export default {
  name: "StudentExaminationInfo",
  data() {
    return {
      currentPage: 1,
      pageSize: 9,
    }
  },
  created() {
    // 请求假数据
      this.getTableData()
  },
  methods: {
    ...mapActions(['getExaminationListBySId','getCurrentStudentExamination']),
      formatDate(str){
          // 将输入的字符串按照空格分割为数组
          const arr = str.split(' ')

          // 获取年、月、日、时、分、秒信息
          // const year = date.getFullYear();
          const month = Number(arr[1]);
          const day = Number(arr[2]);
          const hour = Number(arr[3]);
          const minute = Number(arr[4]);
          const second = Number(arr[5]);

          // 拼接成目标格式的字符串
          // return `${month}月${day}日${hour < 10 ? '0' + hour : hour}点${minute < 10 ? '0' + minute : minute}分${second < 10 ? '0' + second : second}秒`;
           return `${month}月${day}日${hour < 10 ? '0' + hour : hour}点${minute < 10 ? '0' + minute : minute}分`;

      },
      getTableData(searchKey = '' ){
          const requestData = {
             studentNum: this.user.number
          }
          this.getExaminationListBySId(requestData)
          // HttpManager.getTestingPaperViewList(requestData)
          //     .then(res => {
          //         this.totalCount = res.total
          //         console.log(res.hashmap)
          //     }).catch(error => {
          //     console.log(error)
          // })
      },
    getTagType(scope) {
      const flag = scope.row.examinationState
      return flag === 1 ? 'success' : flag === 2 ? 'danger' : ''
    },
    getTagValue(scope) {
      const flag = scope.row.examinationState
      if (flag === 0) {
        return '未开始'
      } else if (flag === 1) {
        return '进行中'
      } else if(flag === 2) {
        return '已结束'
      } else {
        return '未知'
      }
    },
    clickStartExaminationButton(id) {
      provide()
        const mockRequestData = {
            eId: id,
        }
        console.log(mockRequestData)
        this.getCurrentStudentExamination(mockRequestData)
      this.$router.push("/student/examinationId/" + id + "/studentId/" + this.user.id);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
  },
  computed: {
    ...mapState(['studentExaminationList', 'user']),
    currentTableData() {
      return this.studentExaminationList?.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    }
  }
}
</script>

<style scoped>

</style>