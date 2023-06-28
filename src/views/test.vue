<template>
  <div style="width: 100%; height: 100%">
    <!-- 全景 -->
    <div id="pano"></div>
    <div class="divbottom">
      <div>h:<Input v-model="h" style="width: 200px" clearable /></div>
      <div>v:<Input v-model="v" style="width: 200px" clearable /></div>
      <Button type="primary" @click="handleConfirmText">创建热点</Button>
      <Button @click="visible = true">换算方法</Button>
    </div>
    <Modal v-model="visible" title="换算方法" footer-hide>
      <div>screentosphere(x,y, h,v)</div>
      <div>spheretoscreen(h,v, x,y, stereoside*)</div>
      <div>
        将球面空间坐标与屏幕坐标相互之间转换. screentosphere球面坐标转换 x/y 到
        h/v 反之， spheretoscreen 转换 h/v 到 x/y .
      </div>
      <div>参数:</div>
      <div>•x / y</div>
      <div>◦屏幕左上角为定位参考的x/y坐标.</div>
      <div>•h / v</div>
      <div>◦球面空间角度坐标，与热点坐标形式一致 (360x180).</div>
      <div>
        •stereoside (可选) For stereo rendering -
        定义应该映射哪个屏幕侧的坐标，left、right、bottom、top.
      </div>
      <div>Notes: •x,y,h,v 必须是变量名称，不能直接用变量值或数值! •变量不存在则创建.</div>
      <div>样例： screentosphere(mouse.x, mouse.y, toh, tov);</div>
    </Modal>
  </div>
</template>
<script>
// 接口
import { GetTour, GetScene } from "@/api/api";
// 工具
import { getQueryString, getTime } from "@/libs/utils";
// 组件
export default {
  name: "VPano",
  data() {
    return {
      tourId: "",
      sceneId: "",
      scene: {},
      krpano: null,
      readyStatus: false,
      visible: false,
      v: 0,
      h: 0,
    };
  },
  created() {
    const url = window.location.href;
    this.tourId = getQueryString(url, "tourId");
    this.sceneId = getQueryString(url, "sceneId");
  },
  mounted() {
    this.getInfo();
    // 通过接口获取场景信息
  },
  methods: {
    getInfo() {
      const Api = this.tourId ? GetTour : GetScene;
      Api({ tourId: this.tourId })
        .then((res) => {
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
              // 页面title
              document.title = data.Name ? "全景漫游-" + data.Name : "全景漫游";
              var dMeta = document.createElement("meta");
              var sName = "description";
              var sDescription = data.Description
                ? data.Description
                : window.location.href;
              dMeta.setAttribute("name", sName);
              dMeta.setAttribute("content", sDescription);
              document.head.appendChild(dMeta);
              // 载入场景
              this.initKrpano(this.scene.TourXml);
            }
          } else {
            this.showError({
              msg: "错误",
              data: res.ErrorMessage,
            });
          }
        })
        .catch((err) => {
          this.showError(err.response.data);
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
    },

    handleConfirmText() {
      //添加热点
      let name = "spot_video_" + new Date().getTime();
      const text = "h:" + this.h + ",v:" + this.v;
      this.krpano.call("addhotspot(" + name + ");");
      this.krpano.get("hotspot[" + name + "]").loadstyle("video1");
      this.krpano.set("hotspot[" + name + "].ath", this.h);
      this.krpano.set("hotspot[" + name + "].atv", this.v);
      this.krpano.set("hotspot[" + name + "].text", text);
    },
  },
};
</script>

<style scoped>
.divbottom {
  position: fixed;
  display: flex;
  bottom: 0;
  width: 100%;
  height: 100px;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: 99999;
  flex-direction: row;
  flex-wrap: nowrap;
  align-content: flex-start;
  justify-content: space-around;
  align-items: center;
  color: #fff;
  font-size: 24px;
}
</style>
