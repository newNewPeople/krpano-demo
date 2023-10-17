<template>
  <div v-if="visible">
    <Modal
      :width="width"
      v-model="visible"
      :title="current.title"
      footer-hide
      @on-visible-change="modalclose"
    >
      <!-- 同时包含图片和视频 -->
      <div v-if="current.videoUrl && current.imgArr.length">
        <div class="collection-type">
          <RadioGroup
            class="collection-radio"
            v-model="type"
            type="button"
            button-style="solid"
            size="small"
            @on-change="radioChange"
          >
            <Radio label="1">图片</Radio>
            <Radio label="2">视频</Radio>
          </RadioGroup>
        </div>
        <div class="collection-imgs" v-show="type == 1">
          <VueSlickCarousel v-bind="settings" v-if="current.imgArr.length">
            <div v-for="(item, index) in current.imgArr" :key="index">
              <img
                @click="showImg(index)"
                class="collection-img"
                :src="current.imgArr[index]"
                alt=""
              />
            </div>
          </VueSlickCarousel>
        </div>
        <div class="collection-video" v-show="type == 2">
          <video
            id="videohot"
            preload
            v-if="current.videoUrl"
            :src="current.videoUrl"
            controls="controls"
          >
            your browser does not support the video tag
          </video>
        </div>
      </div>

      <!-- 只有图片没视频 -->
      <div v-if="!current.videoUrl && current.imgArr.length">
        <div class="collection-imgs">
          <VueSlickCarousel v-bind="settings" v-if="current.imgArr.length">
            <div v-for="(item, index) in current.imgArr" :key="index">
              <img
                @click="showImg(index)"
                class="collection-img"
                :src="current.imgArr[index]"
                alt=""
              />
            </div>
          </VueSlickCarousel>
        </div>
      </div>

      <!-- 只有视频没有图片 -->
      <div v-if="current.videoUrl && !current.imgArr.length">
        <div class="collection-video">
          <video
            id="videohot"
            preload
            v-if="current.videoUrl"
            :src="current.videoUrl"
            controls="controls"
          >
            your browser does not support the video tag
          </video>
        </div>
      </div>

      <!-- 音频 -->
      <div v-if="current.audioUrl">
        <audio
          class="collection-audio"
          controls
          id="compreAudio"
          v-if="current.audioUrl"
        >
          <source :src="current.audioUrl" type="audio/mpeg" />
          您的浏览器不支持 audio 元素。
        </audio>
      </div>

      <!-- 文字 -->
      <div v-if="current.compreDetail">
        <div class="collection-des">
          {{ current.compreDetail }}
        </div>
      </div>
      <spot-img :current="current" ref="spotImg"></spot-img>
    </Modal>
  </div>
</template>
 
<script>
import SpotImg from "@/components/HotSpot/components/SpotImg.vue";
import VueSlickCarousel from "vue-slick-carousel";
import "vue-slick-carousel/dist/vue-slick-carousel.css";
// optional style for ardivs & dots
import "vue-slick-carousel/dist/vue-slick-carousel-theme.css";
export default {
  name: "SpotCollection",
  components: {
    SpotImg,
    VueSlickCarousel,
  },
  data() {
    return {
      type: "1",
      visible: false,
      value: 0,
      width: 768,
      settings: {
        dots: false,
        edgeFriction: 0.35,
        speed: 500,
        slidesToShow: 1,
      },
    };
  },
  props: {
    current: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.judgeWidth();
  },
  mounted() {
    window.onresize = () => {
      this.judgeWidth();
    };
  },
  watch: {
    current: {
      handler(n) {
        if (n.audioUrl) {
          const _this = this;
          this.$nextTick(() => {
            var eleaudio = document.getElementById("compreAudio");
            eleaudio.addEventListener("play", function () {
              //播放开始执行的函数
              // 1. 暂停背景音乐
              const audio = document.getElementById("bgcAudio");
              audio.pause();
              // 2. 暂停语音助手
              _this.$emit("close2D", false);
              // 3. 暂停视频
              var elevideo = document.getElementById("videohot");
              elevideo && elevideo.pause();
            });
          });
        }
        if (n.videoUrl) {
          const _this = this;
          this.$nextTick(() => {
            var elevideo = document.getElementById("videohot");
            elevideo.addEventListener("play", function () {
              //播放开始执行的函数
              const audio = document.getElementById("bgcAudio");
              audio.pause();
              // 2. 暂停语音助手
              _this.$emit("close2D", false);
              // 3. 暂停音频
              var eleaudio = document.getElementById("compreAudio");
              eleaudio && eleaudio.pause();
            });
          });
        }
      },
      deep: true,
    },
    visible(newVal) {
      this.type = "1";
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
  methods: {
    judgeWidth() {
      let width =
        document.documentElement.offsetWidth || document.body.offsetWidth;
      if (768 < width && width < 1200) {
        this.width = 576;
      } else if (width > 1200) {
        this.width = 768;
      }
    },
    showImg(index) {
      this.current.index = index;
      this.$refs.spotImg.showImg();
    },
    modalclose(val) {
      const status = sessionStorage.getItem("720view_bgcAudio_status");
      const audio = document.getElementById("bgcAudio");
      if (status === "play") {
        audio.play();
      }
    },
    // 点击图片视频切换时方法,点击图片关闭视频
    radioChange(val) {
      if (val == 1) {
        var elevideo = document.getElementById("videohot");
        elevideo.pause();
      }
    },
  },
};
</script>
 
<style lang="less" scoped>
@import url("./style/SpotCollection.less");
</style>
