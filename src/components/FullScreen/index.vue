<!-- 全屏、退出全屏组件 -->
<template>
  <div class="full" @click="handle">
    <single-btn
      :iconClass="fullStatus ? 'icon-quxiaoquanping' : 'icon-quanping'"
      :title="fullStatus ? '退出全屏' : '全屏'"
    ></single-btn>
  </div>
</template>

<script>
import SingleBtn from "@/components/SingleButton";
export default {
  components: {
    SingleBtn,
  },
  data() {
    return {
      fullStatus: false, // true全屏状态 false不是全屏状态
    };
  },
  methods: {
    // 切换全屏/退出全屏
    handle() {
      var el = document.documentElement;
      if (!this.fullStatus) {
        (el.requestFullscreen && el.requestFullscreen()) ||
          (el.mozRequestFullScreen && el.mozRequestFullScreen()) ||
          (el.webkitRequestFullscreen && el.webkitRequestFullscreen()) ||
          (el.msRequestFullscreen && el.msRequestFullscreen());
      } else {
        (document.exitFullscreen && document.exitFullscreen()) ||
          (document.mozCancelFullScreen && document.mozCancelFullScreen()) ||
          (document.webkitExitFullscreen && document.webkitExitFullscreen()) ||
          (document.msExitFullscreen && document.msExitFullscreen());
      }
      this.fullStatus = !this.fullStatus;
    },
  },
};
</script>

<style lang="less" scoped>
.full {
  position: fixed;
  right: 16px;
  top: 16px;
}
</style>