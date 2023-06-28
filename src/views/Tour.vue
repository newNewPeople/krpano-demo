<template>
  <div style="width: 100%; height: 100%">
    <!-- 加载Loading -->
    <full-loading ref="fullLoading"></full-loading>
    <!-- 全景 -->
    <div id="pano"></div>
    <div v-if="readyStatus && krpano">
      <!-- logo -->
      <scene-logo :scene="scene"></scene-logo>
      <!-- 全屏 -->
      <full-screen></full-screen>
      <!-- 背景音乐 -->
      <bgc-music :musicSrc="scene.Sound"></bgc-music>
      <!-- 自动旋转 -->
      <scene-roate ref="sceneRotate"></scene-roate>
      <!-- 分享 -->
      <scene-share :scene="scene"></scene-share>
      <!-- 切换场景 -->
      <scene-change ref="sceneChange" @initHot="initHot" @rotateChange="rotateChange"></scene-change>
      <!-- 热点 -->
      <hot-spot ref="hotSpot" @initHot="initHot"></hot-spot>
      <!-- 设计师信息 -->
      <designer-info :designer="designer"></designer-info>
    </div>
    <!-- 错误提示 -->
    <error-tip ref="error"></error-tip>
  </div>
</template>
<script>
// 接口
import { GetTour, GetScene } from "@/api/api";
// 工具
import { getQueryString, getTime } from "@/libs/utils";
// 组件
import FullLoading from "@/components/FullLoading";
import FullScreen from "@/components/FullScreen";
import BgcMusic from "@/components/BgcMusic";
import SceneRoate from "@/components/SceneRoate";
import SceneShare from "@/components/SceneShare";
import SceneChange from "@/components/SceneChange";
import SceneLogo from "@/components/SceneLogo";
import HotSpot from "@/components/HotSpot";
import ErrorTip from "@/components/ErrorTip";
import DesignerInfo from "@/components/DesignerInfo";
// 图片
import avatar from "@/assets/images/timg.jpg";
export default {
  name: "VPano",
  components: {
    FullLoading,
    FullScreen,
    BgcMusic,
    SceneRoate,
    SceneShare,
    SceneChange,
    ErrorTip,
    SceneLogo,
    HotSpot,
    DesignerInfo,
  },
  data() {
    return {
      avatar,
      tourId: "",
      sceneId: "",
      scene: {},
      krpano: null,
      readyStatus: false,
      designer: {
        portrait: avatar,
        id: "",
        name: "设计师",
        shopName: "",
        phone: " ",
        orderUrl: "https://www.oppein.cn/site/app",
        orderUrlM: "https://m.oppein.cn/site/app",
        designerBarStatus: false,
        tenant_id: "", // 值为2 显示 "预约设计",否则不显示
        pageView: 0,
        Language: "", // 值为zh-CN 显示 "预约设计",否则不显示
      },
    };
  },
  created() {
    const url = window.location.href;
    this.tourId = getQueryString(url, "tourId");
    this.sceneId = getQueryString(url, "sceneId");
  },
  mounted() {
    this.$refs.fullLoading.visible = true;
    this.getInfo();
    // 通过接口获取场景信息
  },
  methods: {
    getInfo() {
      const Api = this.tourId ? GetTour : GetScene;
      Api({ tourId: this.tourId })
        .then((res) => {
          console.log(res,'res');
          if (res.IsSuccess && res.SuccessReturn) {
            this.scene = res.SuccessReturn;
            const data = res.SuccessReturn;
            // 判断是否过期
            const now = getTime();
            if (data.ShareEndDate && now > data.ShareEndDate) {
              this.showError({
                msg: "链接失效",
                data: "来晚了，当前场景的分享时间已到期",
              });
            } else {
              // 载入场景
              this.initKrpano(this.scene.TourXml);
              // 获取用户信息
              if (data.DesignnerHeadImg) {
                this.designer.portrait = data.DesignnerHeadImg;
              }
              // 若品牌只有欧铂丽，全景图预约量尺跳转页面需要更改
              if (data.Brand === "OPL") {
                this.designer.orderUrl = "http://www.oppolia.com";
                this.designer.orderUrlM = "http://www.oppolia.com";
              }
              this.designer.id = data.Cid;
              this.designer.name = data.DesignerName || "设计师";
              this.designer.phone = data.DesignerTel || "";
              this.designer.shopName = data.ShopName || "";
              this.designer.tenant_id = data.tenant_id || "";
              this.designer.Language = data.Language || "";
              this.designer.pageView = data.count ? data.count : 0; // 全景预览量
            }
          } else {
            this.showError({
              data: res.ErrorMessage || "任务异常，请联系管理员查看",
            });
          }
        })
        .catch(_ => {
          this.showError({
            data: "任务异常，请联系管理员查看",
          });
        });
    },
    // 载入场景
    initKrpano(xml) {
      const config = {
        target: "pano",
        xml: xml,
        html5: "auto",
        mobilescale: 1.0,
        showerrors: "false",
        passQueryParameters: true,
        onready: this.ready,
      };
      embedpano(config);
      
    },
    ready() {
      this.krpano = document.getElementById("krpanoSWFObject");
      this.$root.krpano = document.getElementById("krpanoSWFObject");
      setInterval(() => {
        if (this.$refs.fullLoading) {
          this.$refs.fullLoading.visible = false;
          this.$refs.fullLoading.percent = 100;
        }
        this.readyStatus = true;
      }, 1000);
      this.krpano.call("skin_setup_littleplanetintro1"); // 进入时使用小行星视野
    },
    showError(err) {
      this.$refs.fullLoading.visible = false;
      this.$refs.fullLoading.percent = 100;
      this.$refs.error.visible = true;
      this.$refs.error.msg = err.msg;
      this.$refs.error.data = err.data;
    },
    initHot() {
      this.$refs.hotSpot.initHot();
      this.$refs.sceneChange.currentSceneName = this.krpano.get("xml.scene");
    },
    // 切换场景时控制旋转图标的状态
    rotateChange(val) {
      this.$refs.sceneRotate.rotateStatus = val
    },
  },
};
</script>

<style scoped></style>
