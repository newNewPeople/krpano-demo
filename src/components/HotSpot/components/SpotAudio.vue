<!-- 单个音频弹框组件 -->
<template>
  <div v-if="visible">
    <Modal
      v-model="visible"
      :title="current.title"
      footer-hide
    >
      <div class="audio-wrapper">
        <audio id="compreAudio" controls v-if="current.src">
          <source :src="current.src" type="audio/mpeg" />
          您的浏览器不支持 audio 元素。
        </audio>
      </div>
    </Modal>
  </div>
</template>
 
<script>
export default {
  name: "SpotAudio",
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
  watch: {
    current: {
      handler(n) {
        if (n.src) {
          this.$nextTick(() => {
            var eleaudio = document.getElementById("compreAudio");
            eleaudio.addEventListener("play", function () {
              //播放开始执行的函数
              // 1. 暂停背景音乐
              const audio = document.getElementById("bgcAudio");
              audio.pause();
            });
          });
        }
      },
      deep: true,
    },
    visible(newVal) {
      if (!newVal) {
        const status = sessionStorage.getItem("720view_bgcAudio_status");
        const audio = document.getElementById("bgcAudio");
        if (status === "play") {
          audio.play();
        }
      }
      this.$emit("close2D", false);
    },
  },
};
</script>
 
<style scoped>
.audio-wrapper {
  text-align: center;
}
audio {
  width: 100%;
}
</style>
