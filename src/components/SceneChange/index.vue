<!-- 切换场景组件 -->
<template>
  <div>
    <div :class="['scene-change']">
      <!-- 按钮 -->
      <single-btn
        @click.native.stop="handle"
        :iconClass="'icon-cedaohang-mokuai'"
        title="房间切换"
        text="房间"
      ></single-btn>
    </div>

    <!-- 房间切换列表 -->
    <div v-if="listVisible" class="mask" @click="listVisible = false"></div>
    <div v-show="listVisible" :class="['thumb_bg', listVisible ? 'list-show' : 'list-hide']">
      <div class="thumb_box" ref="box">
        <div
          v-for="(item, index) in sceneList"
          :key="item.name"
          :index="index"
          :class="[
            'thumb',
            currentSceneName == item.name
              ? 'thumb-white-border'
              : 'thumb-gray-border',
          ]"
          @click="changeScene(item.name)"
        >
          <img draggable="false" :src="item.thumburl" />
          <p>{{ item.title }}</p>
        </div>
      </div>
      <div class="toleft" @click="handleArrow('left')">
        <i class="iconfont icon-Arrowleft"></i>
      </div>
      <div class="toright" @click="handleArrow('right')">
        <i class="iconfont icon-Arrowright"></i>
      </div>
    </div>
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
      krpano: null,
      sceneList: [],
      currentSceneName: "",
      listVisible: false,
    };
  },
  props: {
    musicSrc: {
      type: String,
    },
  },
  mounted() {
    const _this = this;
    this.krpano = document.getElementById("krpanoSWFObject");
    this.currentSceneName = this.krpano.get("xml.scene");
    this.sceneList = this.krpano.get("scene").getArray();
    this.count = this.sceneList.length - 1;
    this.beauty();
    // 左右移动场景事件
    var touchStartClientX;
    var startscrollLeft;
    const thumb_box = document.getElementsByClassName("thumb_box")[0];
    // 移动端触摸拖动场景列表
    thumb_box.addEventListener(
      "touchstart",
      function (event) {
        touchStartClientX = event.touches[0].clientX;
        startscrollLeft = _this.$refs.box.scrollLeft;
      },
      false
    );
    thumb_box.addEventListener(
      "touchmove",
      function (event) {
        _this.$refs.box.scrollLeft =
          startscrollLeft - event.touches[0].clientX + touchStartClientX;
      },
      false
    );
  },
  methods: {
    // 开启/关闭
    handle() {
      this.listVisible = !this.listVisible;
    },
    changeScene(sceneName) {
      if (sceneName === this.currentSceneName) {
        return;
      } else {
        this.currentSceneName = sceneName;
      }
      this.krpano.call(`loadscene(${sceneName}, null ,MERGE, BLEND(0.8))`);
      this.$emit('initHot')
    // 切换场景时控制旋转图标的状态
      let rotateStatus = this.krpano.get('autorotate.enabled')
      this.$emit('rotateChange', rotateStatus)
      this.beauty();
    },
    handleArrow(val) {
      if (val === "left") {
        this.$refs.box.scrollLeft = this.$refs.box.scrollLeft - 50;
      } else {
        this.$refs.box.scrollLeft = this.$refs.box.scrollLeft + 50;
      }
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

<style lang="less" scoped>
@import url("./index.less");
</style>