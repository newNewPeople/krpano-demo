<template>
  <div>
    <div class="designer hidePhone">
      <img class="portrait" draggable="false" :src="designer.portrait" />
      <div class="designer-right">
        <div class="right-top">
          <p>{{ designer.name }}</p>
          <p v-if="designer.shopName">
            <span class="split">|</span> {{ designer.shopName }}
          </p>
          <a
            v-show="designer.tenant_id == 2 && designer.Language !== 'en-US'"
            target="_blank"
            :href="designer.orderUrl"
          >
            <p class="active">预约设计</p>
          </a>
        </div>
        <div class="right-bottom">
          <p v-if="designer.phone && designer.phone.length">
            {{ designer.phone }}
          </p>
          <p>
            <span class="split">|</span> <span>浏览量: </span>
            {{ designer.pageView }}
          </p>
        </div>
      </div>
    </div>

    <div class="designer hidePc" @click="visible = true" v-if="!isShowOp">
      <img class="portrait" draggable="false" :src="designer.portrait" />
      <div class="designer-right">
        <div class="right-top">
          <p>{{ designer.name }}</p>
        </div>
        <div class="right-bottom">
          <p>
            <span>浏览量: </span>
            {{ designer.pageView }}
          </p>
        </div>
      </div>
    </div>

    <Modal v-model="visible" title="设计师信息" footer-hide>
      <div class="modal">
        <img draggable="false" :src="designer.portrait" />
        <div class="title">{{ designer.name }}</div>
        <div>
          <span>店铺名称: </span>
          <span>{{ designer.shopName }}</span>
        </div>
        <div>
          <span>联系电话: </span>
          <span>{{ designer.phone }}</span>
        </div>
        <div v-show="designer.tenant_id == 2 && designer.Language !== 'en-US'">
          <Button
            style="width: 240px"
            type="primary"
            :to="designer.orderUrlM"
            target="_blank"
            >预约设计</Button
          >
        </div>
      </div>
    </Modal>
  </div>
</template>

<script>
import { getQueryString } from "@/libs/utils";
export default {
  name: "DesignerInfo",
  data() {
    return {
      visible: false,
      isShowOp: false, // 手机端打开，且链接带着from=oppein时，不显示左下角设计师信息框
    };
  },
  props: {
    designer: {
      requried: true,
    },
  },
  mounted() {
    // 手机端打开，且链接带着from=oppein时，不显示左下角设计师信息框
    if(getQueryString(window.location.href, "from") == "oppein") {
      this.isShowOp = true
    }
  }
};
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>