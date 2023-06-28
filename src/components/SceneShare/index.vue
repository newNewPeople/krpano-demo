<!-- 分享组件 -->
<template>
  <div :class="['scene-share', wxShowStatus ? 'show' : '']" class="scene-share" @click="visible = true">
    <!-- 按钮 -->
    <single-btn :iconClass="iconClass" :text="text"></single-btn>
    <Modal v-model="visible" title="分享" footer-hide>
      <div class="img-wrap">
        <img style="max-width:200px" :src="src" alt="" title="保存：鼠标右键，图片另存为" />
        <div class="text">打开微信/QQ，使用“扫一扫”分享方案</div>
        <div class="tip" v-show="!wxShowStatus">鼠标悬浮在二维码上，点击鼠标右键，可另存为</div>
      </div>
    </Modal>
  </div>
</template>

<script>
// 接口
import { setWxShare, getMtdsId, getQrcode } from "@/api/api";
import SingleBtn from "@/components/SingleButton";
// 工具
import { setShareInfo } from "@/assets/js/share.js";
import { getQueryString } from "@/libs/utils";
import QRCode from "qrcode";
// 配置
import config from "@/config";
export default {
  name: "SceneName",
  components: {
    SingleBtn,
  },
  data() {
    return {
      visible: false,
      iconClass: "icon-fenxiang",
      text: "分享",
      src: "",
      wxShowStatus: false,
      showCode: false, // 控制二维码显示是否为小程序的二维码
    };
  },
  props: {
    scene: {
      type: Object,
    },
  },
  created() {
    const url = window.location.href;
    if (url.includes("from=wxApp")) {
      this.wxShowStatus = true;
    }
    if (url.includes("from=oppein")) {
      this.showCode = true;
    }
  },
  mounted() {
    this.createQrcode();
    document.title = this.scene.Name
      ? "全景漫游-" + this.scene.Name
      : "全景漫游";
    var dMeta = document.createElement("meta");
    var sName = "description";
    var sDescription = this.scene.Description
      ? this.scene.Description
      : window.location.href;
    dMeta.setAttribute("name", sName);
    dMeta.setAttribute("content", sDescription);
    document.head.appendChild(dMeta);
    // 微信分享
    const shareData = {
      title: "全景漫游-" + this.scene.Name,
      desc: this.scene.Description,
      link: window.location.href,
      imgUrl: this.scene.Image,
    };
    this.initWxShare(shareData);
  },
  methods: {
    // 分享弹框
    createQrcode() {
      if (this.showCode) {
        this.createOppeinQrcode();
      } else {
        var opts = {
          errorCorrectionLevel: "H",
          type: "image/jpeg",
          quality: 0.3,
          margin: 1,
        };
        const url = window.location.href;
        const _this = this;
        QRCode.toDataURL(url, opts, function (err, url) {
          if (err) throw err;
          _this.src = url;
        });
      }
    },
    // 获取欧派分享二维码
    async createOppeinQrcode() {
      let mtdsId;
      // 1. 将id转为mtdsId
      await getMtdsId(this.scene.Cid).then((res) => {
        if (res.IsSuccess) {
          mtdsId = res.SuccessReturn;
        }
      });
      // 2. 请求mtds接口获取二维码
      let params = {
        mtdsUserId:  mtdsId || "1179057969262755840",
        pageUrl: encodeURIComponent(window.location.href),
      };
      getQrcode(params).then((res) => {
        this.src = config.qrCode.preQrCode + res.qrcodeUrl;
      });
    },
     // 微信分享
    initWxShare(_shareData) {
      const AccessToken = localStorage.getItem("JSAccessToken");
      const jsticket = localStorage.getItem("jsapi_ticket");
      const _signurl = window.location.href;
      setWxShare({
        access_token: AccessToken,
        signurl: _signurl,
        jsticket: jsticket,
      }).then((data) => {
        var JsonData = JSON.parse(data);
        setShareInfo({
          title: _shareData.title, // 分享标题
          summary: _shareData.desc, // 分享内容
          pic: _shareData.imgUrl, // 分享图片
          url: _shareData.link, // 分享链接
          // 微信权限验证配置信息，若不在微信传播，可忽略
          WXconfig: {
            swapTitleInWX: true, // 是否标题内容互换（仅朋友圈，因朋友圈内只显示标题）
            appId: JsonData.appId, // 公众号的唯一标识
            timestamp: JsonData.timestamp, // 生成签名的时间戳
            nonceStr: JsonData.noncestr, // 生成签名的随机串
            signature: JsonData.signature, // 签名
          },
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.scene-share {
  position: fixed;
  bottom: 50px;
  right: 16px;
}
.img-wrap {
  width: 100%;
  height: 100%;
  text-align: center;
  .text {
    color: #fff;
    margin-top: 12px;
  }
  .tip {
    color: #515a6e;
  }
}
@media screen and (max-width: 1080px) {
  .scene-share {
    display: none;
  }
  .show {
    display: inline-block !important;
  }
  .scene-share.scene-share.show {
    bottom: 16px !important;
  }
}
</style>