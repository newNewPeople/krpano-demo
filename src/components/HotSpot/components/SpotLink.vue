<template>
  <!-- 链接热点 使用iframe打开 -->
  <div v-if="src && visible" id="iframeWrap">
    <Icon type="md-close-circle" @click="visible = false" />
    <iframe id="iframe" :src="src"></iframe>
  </div>
</template>

<script>
export default {
  name: "SpotLink",
  props: {
    src: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      visible: false,
    };
  },
};
</script>

<style lang="less" scoped>
#iframeWrap {
  width: 80%;
  position: absolute;
  height: 80%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  .ivu-icon-md-close-circle {
    position: absolute;
    color: gray;
    top: -12px;
    right: -12px;
    font-size: 24px;
    cursor: pointer;
  }
}
#iframe {
  width: 100%;
  height: 100%;
}
@media only screen and (max-width: 667px) {
  #iframeWrap {
    width: 80%;
    position: absolute;
    height: 80%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    .ivu-icon-md-close-circle {
      position: absolute;
      color: gray;
      top: -12px;
      right: -12px;
      font-size: 24px;
      cursor: pointer;
    }
  }

  .mleftbottom {
    display: none;
  }
  .comprehensive {
    display: none;
  }
  .comprehensive-mobile {
    display: block;
    .ivu-switch {
      margin: 10px 0 15px 50%;
    }
    .leftr {
      width: 100%;
    }
    .leftr .ivu-icon-ios-mic-outline {
      cursor: pointer;
      margin-top: 66px;
      font-size: 36px;
      color: #fff;
    }
    .leftr .ivu-icon-ios-mic-outline:hover {
      color: #b3b2af;
    }
    .leftr .compreName {
      font-size: 14px;
      margin: 16px 0;
    }
    .leftr .text {
      font-size: 12px;
      line-height: 2;
      letter-spacing: 2px;
    }
    .leftr {
      display: inline-block;
    }
    .leftr .audioWrap .compreAudio {
      height: 32px;
      width: 100%;
      margin: 32px 0 16px 0;
    }
  }
}
</style>