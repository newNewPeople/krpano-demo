<!-- 单个文本热点弹框组件 -->
<template>
  <Modal v-model="visible" :title="current.title" footer-hide>
    {{ current.detail }}
  </Modal>
</template>

<script>
export default {
  name: "SpotText",
  props: {
    current: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
};
</script>

<style scoped>
</style>