
<!-- 加载组件 -->
<template>
  <div v-if="visible">
    <!-- 嘉居loading -->
    <div class="edit-loader" v-if="isBrand">
      <div class="companyVision">
        <div class="imgClass">
          <img :src="logo" alt="" />
        </div>
        <div class="companySlogan">致力做最好的一体化家居设计平台</div>
      </div>
      <Progress :percent="percent" hide-info />
      <div class="loading">图片加载中...</div>
    </div>
    <!-- 欧派loading -->
    <div
      :class="[
        'edit-loader-oppein',
        { cupboard: furniture == 'cupboard' },
        { oppein: furniture == 'oppein' },
      ]"
      v-else
    >
      <template v-if="furniture !== ''">
        <img class="imgLogo" :src="logo" alt="" />
        <div class="companyVision">
          <div class="imgClass">
            <img :src="oppeinLogo" alt="" />
          </div>
        </div>
        <div class="support">嘉居科技倾力打造</div>
        <Progress :percent="percent" hide-info />
        <div class="loading">图片加载中...</div>
      </template>
    </div>
  </div>
</template>
<script>
import "./loading.less";
import logo from "@/assets/images/logo.png";
import oppeinLogo from "@/assets/images/oppeinLogo.png";
export default {
  name: "FullLoading",
  data() {
    return {
      logo,
      oppeinLogo,
      percent: 10,
      timer: "",
      isBrand: true, // 用于区分显示嘉居logo还是显示欧派logo
      furniture: "oppein",
      visible: true
    };
  },
  props: {
    scene: {
      type: Object,
    },
  },
  created() {
    // url里面携带‘from=oppein’加载页面加载欧派logo
    const url = window.location.href;
    if (url.includes("from=oppein")) {
      this.isBrand = false;
    }
    if (this.isBrand) return false;
    // 区分是否是欧派的橱柜用户,显示不同的加载页面
    if (
      this.scene &&
      this.scene.Category &&
      this.scene.Category.includes("橱柜")
    ) {
      this.furniture = "cupboard";
    } else {
      this.furniture = "oppein";
    }
  },
  mounted() {
    this.dynamicPercent();
  },
  methods: {
    dynamicPercent() {
      this.timer = setInterval(() => {
        this.percent += 10;
        if (this.percent > 99) {
          clearInterval(this.timer);
        }
      }, 100);
    },
  },
};
</script>

<style lang="less" scoped>
@media only screen and (max-width: 667px) {
  .edit-loader-oppein {
    .imgLogo {
      position: absolute;
      left: 1.5%;
      top: 5%;
      width: 30%;
    }
    .companyVision {
      position: absolute;
      top: 39%;
      left: 50%;
      width: 100%;
      transform: translate(-50%, -50%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      color: #fff;
      z-index: 10000;
      .imgClass {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 65%;
          margin-right: 3px;
        }
      }
    }
    // 嘉居倾力支持
    .support {
      position: absolute;
      top: 69%;
      left: 50%;
      font-size: 14px;
      transform: translate(-50%, -50%);
      z-index: 10000;
      color: #fff;
      text-align: center;
    }
  }
}
</style>
