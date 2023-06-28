<!-- 背景音乐组件 -->
<template>
  <div class="music" @click="handle">
    <!-- 按钮 -->
    <single-btn
      :iconClass="musicStatus ? 'icon-musicfill' : 'icon-musicforbidfill1'"
      :title="musicStatus ? '关闭背景音乐' : '暂停背景音乐'"
    ></single-btn>
    <!-- 声音 -->
    <audio id="audio" autoplay loop>你的浏览器不支持audio标签</audio>
  </div>
</template>

<script>
import SingleBtn from "@/components/SingleButton";
import store from '@/store'
import {mapGetters} from 'vuex'
export default {
  components: {
    SingleBtn,
  },
  data() {
    return {
      audio: document.getElementById("audio"),
      musicStatus: false, // true开启音乐状态 false默认不开启音乐状态
      paused: false,
    };
  },
  props: {
    musicSrc: {
      type: String,
    },
  },
  mounted() {
    const krpano = document.getElementById("krpanoSWFObject");
    this.musicStatus = true; // 默认开启背景音乐
    this.audio = document.getElementById("audio");
    this.audio.src = this.musicSrc;
    if (this.musicStatus) {
      this.wxPlayAudio();
    }
  },
  computed:{
    // ...mapGetters(['videoStatus']),
    videoStatus() {
      return store.state.user.videoStatus;
    }
  },
  watch:{
    videoStatus(val) {
      // 要做的操作
      const audio = document.getElementById("audio");
      let currenttime = audio.currentTime // 音乐播放位置
      if(val) {
        audio.currenttime = currenttime
        this.paused = audio.paused
        this.musicStatus = !val
        setTimeout(() => {
          audio.pause()
        }, 100);
      } else {
        if (!this.paused) {
          audio.play()
          this.musicStatus = !val
        } 
      }
    }
  },
  methods: {
    // 开启/关闭音乐
    handle() {
      this.musicStatus = !this.musicStatus;
      if (this.musicStatus) {
        this.audio.play();
      } else {
        this.audio.pause();
      }
    },
    wxPlayAudio() {
      let _this = this;
      const audio = document.getElementById("audio");
      this.audio = document.getElementById("audio");
      audio.src = this.musicSrc;
      wx.config({
        // 配置信息, 即使不正确也能使用 wx.ready
        debug: false,
        appId: "",
        timestamp: 1,
        nonceStr: "",
        signature: "",
        jsApiList: [],
      });
      wx.ready(function () {
        audio.play();
      });
      function audioPlay() {
        if (audio.paused && _this.musicStatus) audio.play();
        document.removeEventListener("click", audioPlay);
        document.removeEventListener("touchstart", audioPlay);
      }
      document.addEventListener("click", audioPlay, false);
      document.addEventListener("touchstart", audioPlay, false);
    },
  },
};
</script>

<style lang="less" scoped>
.music {
  position: fixed;
  right: 16px;
  top: 70px;
}
</style>