<template>
  <div class="btn">
    <i class="iconfont" :class="iconClass"></i>
    <div v-if="text" class="btn-text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: "SingleBtn",
  data() {
    return {};
  },
  props: {
    iconClass: {
      required: true,
    },
    text: {
      type: String,
    },
  },
};
</script>

<style lang="less" scoped>
.btn {
  width: 42px;
  height: 42px;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  line-height: 42px;
  border: 1px solid #999;
  cursor: pointer;
  transition: all ease 0.3s;
  text-align: center;
  &:hover {
    background-color: #1e2329;
  }
  i {
    color: #fff;
    font-size: 20px;
  }
  &-text {
    color: #fff;
    font-size: 14px;
    line-height: 1;
    margin-top: 8px;
  }
}
@media screen and (max-width: 1080px) {
    .btn-text {
        display: none;
    }
}
</style>