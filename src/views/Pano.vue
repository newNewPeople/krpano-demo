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
      <bgc-music
        :musicSrc="scene.Sound"
        @musicStatusChange="musicStatusChange"
      ></bgc-music>
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
      <div class="n-screen" @click="dialogVisible = true">
        <Icon type="ios-browsers-outline" size="20" />
        <p style="margin-top: 10px">多屏联动</p>
      </div>
      <!-- 
      音视频 -->
      <div class="n-av" @click="aV = !aV">
        <Icon type="ios-browsers-outline" size="20" />
        <p style="margin-top: 10px">显示隐藏/视频</p>
      </div>

      <div class="multi-controller-panel pc" v-if="viewing">
        <ul class="clearfix">
          <li class="copy-group-id" v-if="vertical == 'controler'">
            <a class="group-id" href="javascript:;" title="复制识别码"
              >识别码：<i>{{ interlinkage }}  <span
        class="btn"
        style="width: 240px; margin-top: 28px"
        type="primary"
        :data-clipboard-text="interlinkage"
        @click.prevent="copy"
        target="_blank"
        >复制</span
      > </i></a
            >
          </li>
          <li class="controller" v-if="vertical == 'controler'">
            当前控制数：<span class="count">0</span>
          </li>
          <li class="controlled" v-if="vertical == 'viewer'">演示中...</li>
          <li>
            <a
              class="button-close"
              href="javascript:;"
              title="结束控制"
              @click="finish"
              >结束演示</a
            >
          </li>
        </ul>
      </div>

      <!-- 音视频 -->
      <div style="position: fixed;left: 16px;top: 0px;">
        <label>请输入 RoomToken 加入房间开始连麦</label>
        <input id="roomtoken" type="text" />
        <p class="tips">如果您不知道如何生成 RoomToken，查看<a href="https://developer.qiniu.io/rtc/8802/pd-overview" target="_black">这里的接入流程</a></p>
        <button @click="joinRoom()">加入房间</button>
        <p></p>
        <div id="localtracks">本地视频</div>
        <p>远端视频</p>
        <div id="remotetracks" v-show="aV"></div>
      </div>
      <!--  -->
      <div  style="position: fixed;left: 16px;top: 100px;">
      <h2 class="left-align">声网 Voice Web SDK Quickstart</h2>
        <div class="row">
            <div>
                <button type="button" @click="join">JOIN</button>
                <button type="button" @click="leave">LEAVE</button>
            </div>
        </div>
      </div>






    </div>
    <!-- 错误提示 -->
    <error-tip ref="error"></error-tip>

    <Modal
      v-model="dialogVisible"
      title="多屏联动"
      footer-hide
      :mask-closable="false"
    >
      <div slot="title" class="n-screen-title">
        多屏联
      </div>
      <RadioGroup v-model="vertical" vertical>
        <Radio label="controler" size="large" :style="{background:vertical=='controler'?'hsla(0,0%,100%,.9)':'hsla(0,0%,100%,.03)',color:vertical=='controler'?'#000':'hsla(0,0%,100%,.9)'}">
          <span class="card-title">我是演示方</span>
          <p class="aLeft">可以远程控制观看方设备进行方案演示</p>
        </Radio>
        <Radio label="viewer" :style="{background:vertical=='viewer'?'hsla(0,0%,100%,.9)':'hsla(0,0%,100%,.03)',color:vertical=='viewer'?'#000':'hsla(0,0%,100%,.9)'}">
          <span class="card-title">我是观看方</span>
          <p class="aLeft">允许设备被演示方控制来观看方案演示</p>
        </Radio>
        <Button
          style="margin: 22px auto 0"
          class="button-confirm"
          type="primary"
          @click.prevent="expression"
          target="_blank"
          >开始体验 <Icon type="ios-arrow-forward" /></Button
        >
      </RadioGroup>
    </Modal>
    <Modal
      v-model="infoVisible"
      title=""
      footer-hide
      :closable="true"
      :mask-closable="false"
    >
      <div class="codeNum">{{ interlinkage }}</div>
      <div class="codeWord">
        请将识别码发送给演示对象， 对方输入确认后即可开始演示
      </div>
      <Button
        class="btn"
        style="width: 240px;"
        type="primary"
        :data-clipboard-text="interlinkage"
        @click.prevent="copy"
        target="_blank"
        >复制识别码</Button
      >
    </Modal>
    <Modal
      v-model="viewVisible"
      title="输入识别码"
      :mask-closable="false"
      @on-ok="ok"
      ok-text="确认联动"
      @on-cancel="cancel"
    >
      <div>输入由演示方生成的识别码，确认后即可开始观看演示</div>
      <Input
        v-model="groupID"
        style="width: 200px; margin-top: 11px"
        clearable
        placeholder="输入识别码"
        size="large"
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
import Clipboard from "clipboard";
import store from "@/store";

//
// import imMessage from '../BKSIM/message';
// const imConfig = require("../../../BKSIM/configuration");
// import imEventEmitter from "../BKSIM/IMEventEmitter";
import AgoraRTC from "agora-rtc-sdk-ng"
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
      vertical: "controler", //controler 主控方 viewer 被控方
      interlinkage: "",
      viewing: false, //演示状态
      infoVisible: false, //复制识别码
      viewVisible: false,
      groupID: "",
      ws: null,
      WebSocketsExist: "",
      timer: null,
      musicStatus: "",
      socketHost:"ws://183.56.204.212:2718/ws/",
      aV:false,
      //
      role: "", // caller : 呼叫方；calledor:被呼叫的人
      userInfo: null,
      rtc:{
    localAudioTrack: null,
    client: null
},
options:{
    // Pass your App ID here.
    appId: "399108c2adac40f4a8b532d1232bc032",
    // Set the channel name.
    channel: "0712",
    // Pass your temp token here.
    token: "007eJxTYJBj4VYNlXulW8On0hlTpCv8q3mf+/agG/XxnnXM6fopYQoMxpaWhgYWyUaJKYnJJgZpJokWSabGRimGRsZGSckGxkYbitelNAQyMnx7sIKBEQpBfBYGA3NDIwYGAPNHG1s=",
    // Set the user ID.
    uid: 123456
}
    };
  },
  created() {
    const url = window.location.href;
    this.taskId = getQueryString(url, "taskId");
    console.log("current version", QNRTC.VERSION);
  },
  mounted() {
    this.$refs.fullLoading.visible = true;
    this.getInfo();
    //
    this.startBasicCall();
  },
  destroyed() {
    // 销毁监听
    this.ws.onclose();
    this.viewing = false; //全景图链接关闭
    window.clearInterval(this.timer);
  },
  watch:{
    vertical(val) {
     var lessObj = new Object({
      vertical:val
     });
     console.log('lessObj',lessObj)
    }
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
            this.showError({
              data: res.ErrorMessage || "任务异常，请联系管理员查看",
            });
          }
        })
        .catch((_) => {
          this.showError({
            data: "任务异常，请联系管理员查看",
          });
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
    //实时发送KRPano的视角信息 操作信息
    IntervalSendMessage() {
      var krpano = this.krpano;
      var musicStatus = this.musicStatus;
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
          musicStatus: musicStatus,
        };
        //请求已经建立
        if (this.ws.readyState === 1) {
          this.ws.send(JSON.stringify(krObj));
        }
      }
    },
    expression() {
      console.log("vertical", this.vertical);
      this.dialogVisible = false;
      this.viewing = true;
      if (this.vertical == "controler") {
        this.infoVisible = true;
        //TODO 如果是控制方
        console.log("识别码生成");
        let code = this.codeGene(7); //TODO 封装到@/libs
        this.interlinkage = code;
        this.groupID =  code;
        this.initialWebSocket(this.groupID);
      } else if (this.vertical == "viewer") {
        this.viewVisible = true;
        this.groupID = "";//清空
        //TODO 如果是观看方
      }
      // this.$store.commit('videoStatus',this.musicStatus);
    },

    copy() {
      console.log("复制识别码");
      this.infoVisible = false;
      var _this = this;
      var clipboard = new Clipboard(".btn"); //单页面引用
      var clipboard = new this.Clipboard(".btn"); //在main.js中引用
      clipboard.on("success", (e) => {

        //TODO 成功提示
        // this.$Message.info('This is a info tip');

        // 释放内存
        // _this.$Message[info]({
        //   content:"复制成功"
        // });
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        // _this.$Message.info("该浏览器不支持自动复制");
        // 释放内存
        clipboard.destroy();
      });
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
    initialWebSocket(code) {
      // var ws = this.ws;
      var WebSocketsExist = this.WebSocketsExist;
      WebSocketsExist = true;
      try {
        this.ws = new WebSocket(`${this.socketHost}${code}`);
        console.log("this.ws", this.ws);
      } catch (ex) {
        console.log(ex);
        try {
          this.ws = new MozWebSocket(`${this.socketHost}${code}`);
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
      //启动后以50的频率数据通信给观看方
      // this.timer = setInterval(this.IntervalSendMessage, 50);
      this.timer = window.setInterval(this.IntervalSendMessage, 50);
    },
    WSonMessage(event) {
      console.log(event.data);
      console.log("received: %s", event.data);
      //视口同步
      this.reset(event);
    },
    WSonClose() {
      console.log("Websocket closed.");
      // todo 重连机制
      // this.reconnect()
    },
    WSonError() {
      console.log("Websocket error occur.");
      this.reconnect()
    },
    reset(event) {
      console.log("重置", this.vertical);
      var krObj = JSON.parse(event.data);
      var hlookat = krObj.hlookat;
      var vlookat = krObj.vlookat;
      var fov = krObj.fov;
      var scene = krObj.scene;
      var krpano = document.getElementById("krpanoSWFObject");
      var musicStatusSet = !krObj.musicStatus; 
      // 被控制方并且演示状态
      if (krpano && krpano.set && this.vertical == "viewer" && this.viewing) {
        krpano.call("loadscene(get(" + "scene_04" + "), null, MERGE);");
        krpano.set("view.hlookat", hlookat);
        krpano.set("view.vlookat", vlookat);
        krpano.set("view.fov", fov);
        if (krpano.get("xml.scene") !== scene) {
          //loadscene(get(startscene), null, MERGE);
          krpano.call("loadscene(" + scene + ", null, MERGE);");
        }
        store.commit("setVideoStatus", musicStatusSet);// 操作同步 音乐
      }
    },
    finish() {
      console.log("结束演示");
      this.viewing = false;
      window.clearInterval(this.timer);
      //被控方同步结束演示

      this.ws.onclose();
    },
    ok() {
      console.log("赋值识别码", this.groupID);
      if (!this.groupID) {
        return this.showError({
          data: "请输入识别码",
        });
      }
      this.initialWebSocket(this.groupID);
    },
    cancel() {
      console.log("取消");
    },
    addHotsport() {
			if (this.krpano) {
				let h = this.krpano.get('view.hlookat') // 水平视角
	            let v = this.krpano.get('view.vlookat') // 垂直视角
	            let hs_name = "hs" + ((Date.now() + Math.random()) | 0) // 多次点击增加热点，每个热点的名字
				// call(action)调用并执行krpano操作代码，此处为addhotsport
	            this.krpano.call("addhotspot(" + hs_name + ")");
	            // set(variable, value)，将krpano变量设置为给定值，为hotsport设置url
	            this.krpano.set("hotspot["+hs_name+"].url", "https://hospfiles.deephealth.net/patient/avatar-default.png");
	            // 设置坐标
	            this.krpano.set("hotspot["+hs_name+"].ath", h);
	            this.krpano.set("hotspot["+hs_name+"].atv", v);
	            // 设置热点是否跟随场景进行3D扭曲
	            this.krpano.set("hotspot["+hs_name+"].distorted", true);
	            // 热点点击事件
	            if ( this.krpano.get("device.html5") ) {
	                // 对于HTML5，可以将JS函数直接分配给krpano事件
	                this.krpano.set("hotspot["+hs_name+"].onclick", function(hs) {
	                   alert('hotspot "' + hs + '" clicked');
	                }.bind(null, hs_name));
		        } else {
	                // 对于Flash，需要使用js（）操作从Flash调用js（此代码适用于Flash和HTML5）
	                this.krpano.set("hotspot["+hs_name+"].onclick", "js( alert(calc('hotspot \"' + name + '\" clicked')) );");
		        }
			}
		},
    codeGene(n) {
      if (n <= 0) return -1; // 只能输入正整数
      const limit = Math.pow(10, n);
      let value = Math.floor(Math.random() * limit); // 用随机数向下取整，避免多一位
      if (value < limit / 10 && value !== 0) {
        // 取一位的时候就用不到这个函数
        return this.codeGene(n);
      }
      return value;
    },
    musicStatusChange(param) {
      console.log("param", param);
      this.musicStatus = param;
    },
    reconnect() {
      var that = this
      if (that.lockReconnect) return
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      setTimeout(() => {
        console.info('尝试重连...')
        that.initialWebSocket(this.groupID);
        that.lockReconnect = false
      }, 5000)
    },
    // 这里采用的是 async/await 的异步方案，您也可以根据需要或者习惯替换成 Promise 的写法
async joinRoom() {
  // 创建QNRTCClient对象
  const client = QNRTC.createClient();
  // 需要先监听对应事件再加入房间
  this.autoSubscribe(client);
  const roomTokenInput = document.getElementById("roomtoken");
  const roomToken = roomTokenInput.value;
  // 这里替换成刚刚生成的 RoomToken
  await client.join(roomToken);
  console.log("joinRoom success!");
  await this.publish(client);
},
// 增加一个函数 publish，用于采集并发布自己的媒体流
// 这里的参数 client 是指刚刚初始化的 QNRTCClient 对象
async publish(client) {
    // 同时采集麦克风音频和摄像头视频轨道。
    // 这个函数会返回一组audio track 与 video track

    const localTracks = await QNRTC.createMicrophoneAndCameraTracks();
    console.log("my local tracks", localTracks);
    // 将刚刚的 Track 列表发布到房间中
    await client.publish(localTracks);
    console.log("publish success!");
    // 在这里添加
    // 获取页面上的一个元素作为播放画面的父元素
    const localElement = document.getElementById("localtracks");
    // 遍历本地采集的 Track 对象
    for (const localTrack of localTracks) {
        console.log(localTrack)
        // 如果这是麦克风采集的音频 Track，我们就不播放它。
        if (localTrack.isAudio()) continue;
        // 调用 Track 对象的 play 方法在这个元素下播放视频轨
        localTrack.play(localElement, {
            mirror: true
        });
    }
},
// 这里的参数 client 是指刚刚初始化的 QNRTCClient 对象
async subscribe(client, tracks) {
  // 传入 Track 对象数组调用订阅方法发起订阅，异步返回成功订阅的 Track 对象。
  const remoteTracks = await client.subscribe(tracks);

  // 选择页面上的一个元素作为父元素，播放远端的音视频轨
  const remoteElement = document.getElementById("remotetracks");
  // 遍历返回的远端 Track，调用 play 方法完成在页面上的播放
  for (const remoteTrack of [...remoteTracks.videoTracks, ...remoteTracks.audioTracks]) {
      remoteTrack.play(remoteElement);
  }
},

// 这里的参数 client 是指刚刚初始化的 QNRTCClient 对象, 同上
autoSubscribe(client) {
    // 添加事件监听，当房间中出现新的 Track 时就会触发，参数是 trackInfo 列表
    client.on("user-published", (userId,tracks) => {
        console.log("user-published!", userId,tracks);
        this.subscribe(client, tracks)
        .then(() => console.log("subscribe success!"))
        .catch(e => console.error("subscribe error", e));
    });
    // 就是这样，就像监听 DOM 事件一样通过 on 方法监听相应的事件并给出处理函数即可
},
async startBasicCall() {
    // Create an AgoraRTCClient object.
    this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    // Listen for the "user-published" event, from which you can get an AgoraRTCRemoteUser object.
    this.rtc.client.on("user-published", async (user, mediaType) => {
        // Subscribe to the remote user when the SDK triggers the "user-published" event
        await this.rtc.client.subscribe(user, mediaType);
        console.log("subscribe success");

        // If the remote user publishes an audio track.
        if (mediaType === "audio") {
            // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
            const remoteAudioTrack = user.audioTrack;
            // Play the remote audio track.
            remoteAudioTrack.play();
        }

        // Listen for the "user-unpublished" event
        this.rtc.client.on("user-unpublished", async (user) => {
            // Unsubscribe from the tracks of the remote user.
            await this.rtc.client.unsubscribe(user);
        });

    });

    // window.onload = function () {

    //     document.getElementById("join").onclick = async function () {
    //         // Join an RTC channel.
           
    //     }

    //     document.getElementById("leave").onclick = async function () {
         
    //     }
    // }
},
async join(){
  await this.rtc.client.join(this.options.appId, this.options.channel, this.options.token, this.options.uid);
            // Create a local audio track from the audio sampled by a microphone.
    this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
            // Publish the local audio tracks to the RTC channel.
    await this.rtc.client.publish([rtc.localAudioTrack]);

    console.log("publish success!");
},
async leave(){
   // Destroy the local audio track.
   this.rtc.localAudioTrack.close();

// Leave the channel.
await this.rtc.client.leave();
}

    
  },
};
</script>

<style lang="less" scoped>
.n-screen {
  width: 100px;
  text-align: center;
  height: 100px;
  padding-top: 20px;
  position: fixed;
  right: 16px;
  top: 224px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 24px;
  color: #fff;
  cursor: pointer;
}
.n-av{
  width: 100px;
  text-align: center;
  height: 100px;
  padding-top: 20px;
  position: fixed;
  right: 16px;
  top: 350px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 24px;
  color: #fff;
  cursor: pointer;
}
.n-screen-title{
  color: red;

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
.multi-controller-panel li.controlled {
  margin: 0 15px;
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
.content {
  padding: 20px 0 10px;
  font-size: 14px;
}

.tui-control {
  display: block;
  position: relative;
  margin-bottom: 4px;
  cursor: pointer;
  color: var(--color_text__secondary);
  text-transform: none;
  font-size: 12px;
}
.select-card {
  background: hsla(0, 0%, 100%, 0.03);
  border-radius: 8px;
  height: 120px;
  padding: 22px 30px 0;
  margin: 12px 30px;
  color: #fff;
  position: relative;
}
.select-card .card-content {
  position: absolute;
  top: 25px;
  left: 50px;
}
.card-title {
  font-weight: 600;
  vertical-align: middle;
  margin-left: 12px;
  font-size: 24px;
}

.ivu-radio-group-vertical .ivu-radio-wrapper {
  display: block;
  height: 104px;
  line-height: 30px;
  background: hsla(0, 0%, 100%, 0.9);
  color: rgba(3, 9, 17, 0.8);
  width: 100%;
  margin-bottom: 12px;
  padding: 22px 30px;
  border-radius: 12px;
  font-size: 14px!important;
}
.ivu-radio-group {
  display: inline-block;
  font-size: 14px;
  vertical-align: middle;
  width: 100%;
}
.button-confirm {
  opacity: 0.9;
  background: #fff;
  border-radius: 20px;
  color: #150f08;
  border: none;
  height: 40px;
  line-height: 40px;
  width: 127px;
  margin: 22px auto 0;
  display: block;
  padding: 0;
}
.aLeft{
  position: absolute;
  left: 64px;
}

select {
            width: 300px;
        }

        section {
            margin-bottom: 20px;
        }
         #remotetracks {
          width: 320px;
          height: 240px;
          
          background-color: rgba(0, 0, 0, 0.5);
        }
        #localtracks {
          width: 100px;
          height:100px;
          position: fixed;
  right: 100px;
  bottom: 50px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
        }
</style>

