<template>
  <div>
    <!-- 文本热点 -->
    <spot-text ref="spotText" :current="spotTextObj"></spot-text>
    <!-- 图片热点  -->
    <spot-img ref="spotImg" :current="spotImgObj"></spot-img>
    <!-- 视频热点  -->
    <spot-video ref="spotVideo" :current="spotVideoObj"></spot-video>
    <!-- 链接热点  -->
    <spot-link ref="spotLink" :src="spotLinkSrc"></spot-link>
  </div>
</template>

<script>
import SpotText from "@/components/HotSpot/components/SpotText.vue";
import SpotImg from "@/components/HotSpot/components/SpotImg.vue";
import SpotVideo from "@/components/HotSpot/components/SpotVideo.vue";
import SpotLink from "@/components/HotSpot/components/SpotLink.vue";
export default {
  name: "HotSpot",
  components: {
    SpotText,
    SpotImg,
    SpotVideo,
    SpotLink,
  },
  data() {
    return {
      krpano: null,
      spotTextObj: {
        // 文本热点弹框对象
        title: "",
        detail: "",
      },
      spotImgObj: {
        // 图片热点对象
        index: 0,
        imgArr: [],
      },
      sign: 0, // 标志位，防止点击一次图片热点出现多个热点图片
      spotVideoObj: {
        // 视频热点弹框对象
        title: "",
        src: "",
      },
      spotLinkSrc: "",
    };
  },
  created() {
    this.initHot();
  },
  methods: {
    initHot() {
      const _this = this;
      this.krpano = document.getElementById("krpanoSWFObject");
      this.krpano
        .get("hotspot")
        .getArray()
        .map((v) => {
          if (v.hottype - 0 === 1) {
            _this.currentSceneName = _this.krpano.get('xml.scene')
            v.onclick = function () {
              _this.handleMap(v);
            };
          } else if (v.hottype - 0 === 2) {
            v.onclick = function () {
              // 文本热点
              _this.handleText(v);
            };
          } else if (v.hottype - 0 === 3) {
            // 图片热点
            v.onclick = function () {
              if (_this.sign === 0) {
                _this.sign = 1;
                setTimeout(() => {
                  _this.sign = 0;
                }, 500);
                _this.handleImg(v);
              }
            };
          } else if (v.hottype - 0 === 4) {
            // 链接热点
            v.onclick = function () {
              _this.spotLinkSrc = v.detail;
              _this.$refs.spotLink.visible = true;
            };
          } else if (v.hottype - 0 === 5) {
            // 视频热点
            v.onclick = function () {
              _this.handleVideo(v);
            };
          }
        });
    },
    // 处理导航热点
    handleMap(v) {
      if (v.linkedscene === this.currentSceneName) {
        return;
      } else {
        this.currentSceneName = v.linkedscene;
      }
      this.krpano.call(`loadscene(${v.linkedscene}, null ,MERGE, BLEND(0.8))`);
      this.beauty();
      this.$emit("initHot");
    },
    // 处理文本热点
    handleText(v) {
      this.spotTextObj.title = v.text;
      this.spotTextObj.detail = v.detail;
      this.$refs.spotText.visible = true;
    },
    // 处理图片热点
    handleImg(v) {
      this.spotImgObj.index = 0;
      this.spotImgObj.imgArr = [v.detail];
      this.$refs.spotImg.showImg();
    },
    // 处理视频热点
    handleVideo(v) {
      this.spotVideoObj.title = v.text;
      this.spotVideoObj.src = v.detail;
      this.$refs.spotVideo.visible = true;
    },
    beauty() {
      this.krpano = document.getElementById("krpanoSWFObject");
      let brightness = this.krpano.get("beauty.brightness");
      this.krpano.set("xml_color_r", 1.0);
      this.krpano.set("xml_color_g", 1.0);
      this.krpano.set("xml_color_b", 1.0);
      let contrast = this.krpano.get("beauty.contrast");
      let saturation = this.krpano.get("beauty.saturation");

      let hue = this.krpano.get("beauty.hue");
      let btype = this.krpano.get("beauty.btype");
      this.krpano.set("xml_brightness", brightness / 100);
      this.krpano.set("xml_contrast", contrast / 100);
      this.krpano.set("xml_saturation", saturation / 100);
      this.krpano.set("xml_hue", hue / 100);

      switch (btype - 0) {
        case 0: // 原图
          this.krpano.set("xml_color_r", 1.0);
          this.krpano.set("xml_color_g", 1.0);
          this.krpano.set("xml_color_b", 1.0);
          break;
        case 1: // 温馨黄
          this.krpano.set("xml_color_b", 0.8);
          this.krpano.set("xml_color_r", 1.0);
          this.krpano.set("xml_color_g", 1.0);
          break;
        case 2: // 浪漫紫
          this.krpano.set("xml_color_r", 1.0);
          this.krpano.set("xml_color_g", 0.8);
          this.krpano.set("xml_color_b", 1.0);
          break;
        case 3: // 摩登灰
          this.krpano.set("xml_color_r", 0.8);
          this.krpano.set("xml_color_g", 0.8);
          this.krpano.set("xml_color_b", 0.8);
          break;
      }
      this.krpano.call("beauty_loop");
    },
  },
};
</script>

<style>
</style>