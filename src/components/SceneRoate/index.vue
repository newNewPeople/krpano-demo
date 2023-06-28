<!-- 场景旋转组件 -->
<template>
  <div class="roate">
    <!-- 按钮 -->
    <single-btn
      @click.native="handle"
      :iconClass="rotateStatus ? 'icon-tingzhishuaxin' : 'icon-shuaxin'"
      :title="rotateStatus ? '关闭自动旋转' : '开启自动旋转'"
    ></single-btn>

    <single-btn
      v-if="isMobileStatus"
      @click.native="handleGyro"
      style="margin-top: 12px"
      :iconClass="gyroStatus ? 'icon-xuanzhuan' : 'icon-xuanzhuanshouji'"
      :title="gyroStatus ? '关闭陀螺仪' : '开启陀螺仪'"
    ></single-btn>
  </div>
</template>

<script>
import SingleBtn from "@/components/SingleButton";
// 工具
import { isMobile } from "@/libs/utils";
export default {
  components: {
    SingleBtn,
  },
  data() {
    return {
      krpano: null,
      isMobileStatus: false,
      rotateStatus: false, // true开启状态 false默认不开启状态
      gyroStatus: false,
    };
  },
  mounted() {
    this.isMobileStatus = isMobile();
    this.krpano = document.getElementById("krpanoSWFObject");
    this.rotateStatus = this.krpano.get("autorotate.enabled") || false;
    if (this.gyroStatus) {
      this.rotateStatus = false;
    }
  },
  // destroyed() {
  //   sessionStorage.setItem("gyroStatus", false);
  // },
  methods: {
    // 开启/关闭自动旋转
    handle() {
      if (this.rotateStatus) {
        // 1. 关闭自动旋转
        this.krpano.set("autorotate.enabled", false);
      } else {
        // 2. 开启自动旋转
        this.krpano.set("autorotate.enabled", true);
        this.krpano.set(
          "autorotate.waittime",
          this.krpano.get("autorotate.waittime") || 0
        );
        // 2.1 开启自动旋转后，默认关闭陀螺仪
        this.gyroStatus = false;
        this.krpano.call("set(plugin[skin_gyro].enabled, false);");
      }
      this.rotateStatus = !this.rotateStatus;
    },
    // 开启/关闭陀螺仪
    handleGyro() {
      if (!this.gyroStatus) { // 1. 开启陀螺仪
        // 关闭自动旋转
        this.rotateStatus = false;
        this.krpano.set("autorotate.enabled", this.rotateStatus);
        //开启陀螺仪
        this.iosGrantedTips();
        this.krpano.call("set(plugin[skin_gyro].enabled,true);");
        sessionStorage.setItem("gyroStatus", "true");
      } else {
        //关闭陀螺仪
        this.krpano.call("set(plugin[skin_gyro].enabled,false);");
        sessionStorage.setItem("gyroStatus", "false");
      }
      this.gyroStatus = !this.gyroStatus;
    },
    iosGrantedTips() {
      var that = this;
      var ua = navigator.userAgent.toLowerCase();
      if (ua.indexOf("like mac os x") > 0) {
        var reg = /os [\d._]*/gi;
        var verinfo = ua.match(reg);
        var version = (verinfo + "")
          .replace(/[^0-9|_.]/gi, "")
          .replace(/_/gi, ".");
        var arr = version.split(".");
        if (arr[0] > 12 && arr[1] > 2) {
          //对13.3以后的版本处理,包括13.3,
          DeviceMotionEvent.requestPermission()
            .then((permissionState) => {
              if (permissionState === "granted") {
                window.addEventListener("devicemotion", () => {});
                that.krpano.call("set(plugin[skin_gyro].enabled,true);");
              }
            })
            .catch((err) => {
              //alert("用户未允许权限") type:'gyroIndex'
              //======这里可以防止重复授权，需要改动，因为获取权限需要点击事件才能触发，所以这里可以改成某个提示框===//
              // showLayer("由于IOS系统需要手动获取访问动作与方向的权限，为了保证抽奖正常运行，请在访问提示中点击允许！","","确定",function(index){
              //     ios13granted();
              //     layer.close(index);
              // })
            });
        } else {
          //13.3以前的版本
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.roate {
  position: fixed;
  right: 16px;
  top: 124px;
}
</style>