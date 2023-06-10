<template>
  <div>
    <el-dialog
        v-model="viewMeddleDialogDisplay"
        title="干预信息" width="760"
        align-center
        @close="viewMeddleInfoDialogDialogClose">
      <span style="display: block; margin-bottom: 5px">第一次干预提示</span>
      <span style="display: block; margin-bottom: 5px">第二次干预提示</span>
      <span style="display: block; margin-bottom: 5px">第三次干预提示</span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ViewMeddleInfoDialog",
  props: {
    isShowDialog: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    isShowDialog: {
      handler(newValue, oldValue) {
        this.viewMeddleDialogDisplay = newValue
      },
      deep: true
    },
  },
  data() {
    return {
      viewMeddleDialogDisplay: false,
    }
  },
  methods:{
    viewMeddleInfoDialogDialogClose() {
      this.viewMeddleDialogDisplay = false
      this.$emit("closeDialog", this.viewMeddleDialogDisplay)
    },
  }
}
</script>

<style scoped>

</style>