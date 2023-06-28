<!-- 错误提示组件 -->
<template>
  <div class="scene-share" v-if="visible">
    <Modal
      v-model="visible"
      title="错误"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <Alert type="error" show-icon>
        {{ msg }}
        <span slot="desc">
          {{ data }}
        </span>
      </Alert>
    </Modal>
  </div>
</template>

<script>
export default {
  name: "ErrorTip",
  data() {
    return {
      visible: false,
      msg: "任务异常，请联系管理员查看",
      data: "",
    };
  },
  mounted() {},
  methods: {
    // 分享弹框
    handle() {},
  },
};
</script>

<style lang="less" scoped>
/deep/ .ivu-alert-error {
  border: none !important;
  background-color: transparent !important;
}
/deep/.ivu-alert-message,
/deep/.ivu-alert-desc {
  color: #fff !important;
}
</style>