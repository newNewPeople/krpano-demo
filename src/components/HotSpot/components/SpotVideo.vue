<template>
  <div v-if="visible">
    <Modal v-model="visible" :title="current.title" footer-hide>
      <video id="videohot" v-if="current.src" :src="current.src" autoplay controls="controls">
        your browser does not support the video tag
      </video>
    </Modal>
  </div>
</template>

<script>
import store from '@/store'
export default {
  name: "SpotVideo",
  data() {
    return {
      visible: false,
    };
  },
  props: {
    current: {
      type: Object,
      required: true,
    },
  },
  watch: {
    visible (val) {
      store.commit('setVideoStatus', val)
    }
  },
  methods: {
    pause () {
      // 暂停播放
      const video = document.getElementById('videohot')
      video.pause();
      video.play();
    }
  }
};
</script>

<style lang="less" scoped>
#videohot {
  width: 100%;
}
</style>