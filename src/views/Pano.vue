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
      <scene-roate></scene-roate>
      <!-- 分享 -->
      <scene-share :scene="scene"></scene-share>
      <!-- 热点 -->
      <hot-spot ref="hotSpot"></hot-spot>
      <!-- 设计师信息 -->
      <designer-info :designer="designer"></designer-info>

      <!-- 
      多屏联动 -->
      <div class="n-screen" @click="dialogVisible = true">多屏联动</div>
      <div class="multi-controller-panel pc">
        <ul class="clearfix">
          <li class="copy-group-id">
            <a class="group-id" href="javascript:;" title="复制识别码"
              >识别码：<i>06270470 复制 </i></a
            >
          </li>
          <li class="controller">当前控制数：<span class="count">0</span></li>
          <li>
            <a class="button-close" href="javascript:;" title="结束控制"
              >结束演示</a
            >
          </li>
        </ul>
      </div>
    </div>
    <!-- 错误提示 -->
    <error-tip ref="error"></error-tip>

    <Modal
      v-model="dialogVisible"
      title="多屏联动"
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <RadioGroup v-model="vertical" vertical>
        <Radio label="controler" size="large">
          <Icon type="social-android"></Icon>
          <span>我是演示方</span>
          <!-- <p>可以远程控制观看方设备进行方案演示</p> -->
        </Radio>
        <Radio label="viewer">
          <Icon type="social-windows"></Icon>
          <span>我是观看方</span>
        </Radio>
        <Button
          style="width: 240px; margin: 22px auto 0"
          type="primary"
          @click.prevent="expression"
          target="_blank"
          >开始体验</Button
        >
      </RadioGroup>
    </Modal>
    <Modal
      v-model="infoVisible"
      title=""
      footer-hide
      :closable="false"
      :mask-closable="false"
    >
      <div class="codeNum">05038808</div>
      <div class="codeWord">
        请将识别码发送给演示对象， 对方输入确认后即可开始演示
      </div>
      <Button
        style="width: 240px; margin-top: 28px"
        type="primary"
        @click.prevent="copy"
        target="_blank"
        >复制识别码</Button
      >
    </Modal>
    <!-- 识别码框 -->
    <!-- <div class="codeNumBox">

    </div> -->
    <Modal
      v-model="viewVisible"
      title="输入识别码"
      :closable="false"
      :mask-closable="false"
    >
      <div>输入由演示方生成的识别码，确认后即可开始观看演示</div>
      <!-- <Space direction="vertical" size="large" type="flex">
        <Input search placeholder="Enter something..." />
    </Space>     -->
      <Input
        v-model="GroupID"
        style="width: 200px; margin-top: 11px"
        clearable
        placeholder="输入识别码"
      />
    </Modal>
  </div>
</template>
<script>
// 接口
import { GetPano } from "@/api/api";
// 工具
import { getQueryString, getTime } from "@/libs/utils";
// 组件
import FullLoading from "@/components/FullLoading";
import FullScreen from "@/components/FullScreen";
import BgcMusic from "@/components/BgcMusic";
import SceneRoate from "@/components/SceneRoate";
import SceneShare from "@/components/SceneShare";
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
    ErrorTip,
    SceneLogo,
    HotSpot,
    DesignerInfo,
  },
  data() {
    return {
      avatar,
      taskId: "",
      scene: {},
      krpano: null,
      readyStatus: false,
      xmlstr: "",
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
      dialogVisible: false,
      vertical: "",
      infoVisible: false,
      viewVisible: true,
      GroupID: "",
      ws: null,
      WebSocketsExist: "",
    };
  },
  created() {
    const url = window.location.href;
    this.taskId = getQueryString(url, "taskId");
    this.initialWebSocket();
  },
  mounted() {
    this.$refs.fullLoading.visible = true;
    this.getInfo();
  },
  methods: {
    // 通过接口获取场景信息
    getInfo() {
      GetPano({ taskId: this.taskId })
        .then((res) => {
          console.log("res", res);
          if (res.IsSuccess && res.SuccessReturn) {
            this.scene = res.SuccessReturn;
            this.scene.formatterXml = formatXml(this.scene.TourXml);
            this.xmlstr = formatXml(res.SuccessReturn.TourXml);
            // 载入场景
            this.initKrpano(this.scene.formatterXml);
            // 获取用户信息
            const data = res.SuccessReturn;
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
          } else {
            // this.showError({
            //   data: res.ErrorMessage || "任务异常，请联系管理员查看",
            // });
          }
        })
        .catch((_) => {
          // this.showError({
          //   data: "任务异常，请联系管理员查看",
          // });
        });
    },
    // 载入场景
    initKrpano(xml) {
      let _this = this;
      const config = {
        target: "pano",
        xml: null,
        html5: "auto",
        passQueryParameters: true,
        onready: function (krpano) {
          krpano.call("loadxml(" + _this.xmlstr + ")");
          _this.ready();
          _this.krpanoReady(krpano);
        },
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
      // setInterval(this.i, 50);
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
    },
    //实时发送KRPano的视角信息
    IntervalSendMessage() {
      var krpano = this.krpano;
      console.log("krpano", krpano);

      if (krpano && krpano.get) {
        var hlookat = krpano.get("view.hlookat");
        var vlookat = krpano.get("view.vlookat");
        var fov = krpano.get("view.fov");
        var scene = krpano.get("xml.scene");

        var krObj = {
          hlookat: hlookat,
          vlookat: vlookat,
          fov: fov,
          scene: scene,
        };

        console.log("krObj", krObj);
        console.log(this.ws, " this.ws");
        if (this.ws.readyState === 1) {
          console.log(JSON.stringify(krObj))
          this.ws.send(JSON.stringify(krObj));
        }
      }
    },
    i() {
      let krObj = {
        hlookat: -59.95619140592913,
        vlookat: 7.455078649912778,
        fov: 95,
        scene: "panoe247e19c-4588-4ce0-a4d8-120c8a5da7c9",
      };
      var hlookat = krObj.hlookat;
      var vlookat = krObj.vlookat;
      var fov = krObj.fov;
      var scene = krObj.scene;
      var krpano = this.krpano;
      if (krpano && krpano.set) {
        krpano.call("loadscene(get(" + "scene_04" + "), null, MERGE);");
        krpano.set("view.hlookat", hlookat);
        krpano.set("view.vlookat", vlookat);
        krpano.set("view.fov", fov);
        if (krpano.get("xml.scene") !== scene) {
          //loadscene(get(startscene), null, MERGE);
          krpano.call("loadscene(" + scene + ", null, MERGE);");
        }
      }
    },
    expression() {
      console.log("vertical", this.vertical);
      this.infoVisible = true;
      this.dialogVisible = false;
    },
    copy() {
      console.log("复制识别码");
      this.infoVisible = false;
      var _this = this
      var clipboard = new Clipboard('.btn') //单页面引用
      var clipboard = new this.Clipboard('.btn') //在main.js中引用
      clipboard.on('success', (e) => {
        // 释放内存
        _this.$Message.info('复制成功');
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        // 不支持复制
        _this.$Message.info('该浏览器不支持自动复制');
        // 释放内存
        clipboard.destroy()
      })
    },
    krpanoReady(krpano) {
      // console.log('wss',wss)
      // const wss = new WebSocket.Server({
      //           port: 8080
      //       });

      //       wss.on('connection', function connection(ws) {
      //         console.log('WS')
      //           ws.on('message', function incoming(message) {
      //               console.log('received: %s', message);
      //               // krObj = JSON.parse(message);
      //               // var hlookat = krObj.hlookat;
      //               // var vlookat = krObj.vlookat;
      //               // var fov = krObj.fov;
      //               // var scene = krObj.scene;
      //               // var krpano = document.getElementById("krpanoSWFObject");
      //               // if (krpano && krpano.set) {
      //               //     krpano.call("loadscene(get(" + "scene_04" + "), null, MERGE);")
      //               //     krpano.set("view.hlookat", hlookat);
      //               //     krpano.set("view.vlookat", vlookat);
      //               //     krpano.set("view.fov", fov);
      //               //     if (krpano.get("xml.scene") !== scene) {
      //               //         //loadscene(get(startscene), null, MERGE);
      //               //         krpano.call("loadscene(" + scene + ", null, MERGE);")
      //               //     }
      //               // }
      //           });

      //           ws.send('something');
      //       });
      //       console.log('wss',wss)
      console.log("krpano", krpano);
      krpano.call("trace(krpano is ready...)");
      krpano.call("loadscene(scene_04, null, MERGE);");
    },
    initialWebSocket() {
      // var ws = this.ws;
      var WebSocketsExist = this.WebSocketsExist;
      WebSocketsExist = true;
      try {
        this.ws = new WebSocket("ws://183.56.204.212:2718/ws/12345678910");
        console.log("this.ws", this.ws);
      } catch (ex) {
        console.log(ex);
        try {
          this.ws = new MozWebSocket("ws://183.56.204.212:2718/ws/12345678910");
          console.log("this.ws", this.ws);
        } catch (ex) {
          WebSocketsExist = false;
        }
      }
      if (WebSocketsExist) {
        console.log("The current browser support websocket!");
      } else {
        console.log("The current browser not support websocket!");
        return;
      }
      this.ws.onopen = this.WSonOpen;
      this.ws.onmessage = this.WSonMessage;
      this.ws.onclose = this.WSonClose;
      this.ws.onerror = this.WSonError;
    },
    WSonOpen() {
      console.log("websocket opened success!");
      setInterval(this.IntervalSendMessage, 50);
    },
    WSonMessage(event) {
      console.log(event.data);
      console.log('received: %s', event.data);
      this.reset(event)
                    
    },
    WSonClose() {
      console.log("Websocket closed.");
    },
    WSonError() {
      console.log("Websocket error occur.");
    },
    reset(event){
   console.log('重置',this.vertical);

      var krObj = JSON.parse(event.data);
                    var hlookat = krObj.hlookat;
                    var vlookat = krObj.vlookat;
                    var fov = krObj.fov;
                    var scene = krObj.scene;
                    var krpano = document.getElementById("krpanoSWFObject");
                    if (krpano && krpano.set&&this.vertical=="viewer") {
                        krpano.call("loadscene(get(" + "scene_04" + "), null, MERGE);")
                        krpano.set("view.hlookat", hlookat);
                        krpano.set("view.vlookat", vlookat);
                        krpano.set("view.fov", fov);
                        if (krpano.get("xml.scene") !== scene) {
                            //loadscene(get(startscene), null, MERGE);
                            krpano.call("loadscene(" + scene + ", null, MERGE);")
                        }
                    }

    }
  },
};
</script>

<style scoped>
.n-screen {
  width: 100px;
  height: 100px;
  position: fixed;
  right: 16px;
  top: 224px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 24px;
  color: #fff;
}
/deep/ .codeNum {
  font-size: 36px;
  color: #fff;
  font-weight: 600;
  margin-bottom: 20px;
}
/deep/ .codeWord {
  margin-bottom: 20px;
}
.multi-controller-panel.pc {
  /* position: fixed; */
  bottom: 100px;
  right: 24px;
}
.multi-controller-panel {
  position: fixed;
  pointer-events: all;
  bottom: 130px;
  right: 14px;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  box-shadow: 0 12px 24px 0 rgba(30, 35, 41, 0.1);
  border-radius: 34px;
  height: 40px;
  line-height: 40px;
  padding: 0 4px;
}
.multi-controller-panel ul {
  padding: 0;
  display: flex;
}
.multi-controller-panel li {
  position: relative;
  list-style: none;
  display: block;
  font-size: 12px;
}
.multi-controller-panel li:first-child {
  border: none;
  color: #fff;
  text-align: center;
}
.multi-controller-panel li.controller {
  margin-right: 15px;
}
.multi-controller-panel .button-close {
  color: #fff;
  background: hsla(0, 0%, 100%, 0.2);
  border-radius: 22px;
  width: 70px;
  height: 32px;
  line-height: 32px;
  display: block;
  text-align: center;
  margin-top: 4px;
  font-size: 12px;
}
.multi-controller-panel li.copy-group-id {
  margin: 0 15px;
}
.multi-controller-panel .group-id {
  color: #fff;
}
.multi-controller-panel .group-id i {
  color: #45fff6;
  text-decoration: underline;
  font-style: normal;
}
/* .codeNumBox{
  width: 440px;
    height: 266px;
    background: rgba(25,29,33,.8);
    box-shadow: 0 12px 24px 0 rgba(0,0,0,.1);
    border-radius: 8px;
    padding: 40px 0;
    text-align: center;
    color: #fff;
    font-size: 14px;
} */
</style>

