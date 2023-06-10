<template>
  <div>
    <el-dialog
        class="general_situation_dialog"
        v-model="generalSituationDisplay"
        title="查看总况"
        width="75%"
        align-center
        @close="scoreChartDialogClose">
      <canvas id="myChart" max-height="450"></canvas>
    </el-dialog>
  </div>
</template>

<script>
  import Chart from 'chart.js/auto';
  export default {
    name: "ScoreChartDialog",
    props: {
      isShowDialog: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      isShowDialog: {
        handler(newValue, oldValue) {
          this.generalSituationDisplay = newValue
          if (newValue) {
            this.$nextTick(() => {
              this.renderChart()
            })
          }
        },
        deep: true
      }
    },
    data() {
      return {
        generalSituationDisplay: false
      }
    },
    methods: {
      scoreChartDialogClose() {
        this.generalSituationDisplay = false
        this.$emit("closeScoreChartDialog", this.generalSituationDisplay)
      },
      renderChart() {
        const ctx = document.getElementById('myChart');
        new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['第1题', '第2题', '第3题', '第4题', '第5题', '第6题', '第7题', '第8题',
              '第9题', '第10题', '第11题', '第12题', '第13题', '第14题', '第15题', '第16题'],
            datasets: [{
              label: '第一次干预的次数',
              data: [12, 10, 11, 13, 15, 12, 12, 13, 10, 11, 13, 15, 12, 12, 13, 14],
              borderWidth: 1
            },
              {
                label: '第二次干预的次数',
                data: [7, 8, 6, 9, 7, 8, 6, 9, 7, 8, 6, 9, 7, 8, 6, 9],
                borderWidth: 1
              },
              {
                label: '第三次干预的次数',
                data: [2, 5, 3, 5, 2, 3, 5, 2, 2, 5, 3, 5, 2, 3, 5, 2],
                borderWidth: 1
              }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    }
  }
</script>

<style>
  .general_situation_dialog .el-dialog__body {
    padding-top: 3px;
  }
</style>