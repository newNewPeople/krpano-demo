<template>
  <div></div>
</template>

<script>
import { api as viewerApi } from "v-viewer";
import "viewerjs/dist/viewer.css";
export default {
  name: "SpotImg",
  data() {
    return {
      visible: false,
    };
  },
  props: {
    current: {
      type: Object,
      required: true,
    },
  },
  methods: {
    showImg() {
      viewerApi({
        options: {
          backdrop: true,
          inline: false,
          button: true,
          navbar: false,
          title: false,
          toolbar: false,
          tooltip: false,
          movable: true,
          zoomable: true,
          rotatable: false,
          scalable: false,
          transition: true,
          fullscreen: true,
          keyboard: true,
          initialViewIndex: this.current.index || 0
        },
        images: this.current.imgArr,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.collection {
  &-type {
    display: inline-block;
    width: 100%;
    text-align: center;
    margin-top: -4px;
  }
  &-audio {
    height: 32px;
    width: 100%;
    margin-bottom: 8px;
  }
  &-title {
    font-size: 16px;
    margin-bottom: 16px;
  }
  &-des {
    color: #eee;
  }
  &-img {
    height: 280px;
    width: 100%;
    object-fit: cover;
  }
}

/deep/.ivu-carousel-arrow {
  background-color: rgba(31, 45, 61, 1) !important;
}
/deep/.collection-radio {
  margin-bottom: 16px;
}
/deep/.collection-radio label {
  background-color: #1e2329 !important;
  color: #fff;
}
/deep/.collection-radio label.ivu-radio-wrapper-checked {
  color: #1a7af8;
}

@media only screen and (max-width: 1200px) {
  .collection {
    &-video {
      margin-bottom: 32px;
    }
    &-imgs {
      margin-bottom: 32px;
    }
  }
}
@media only screen and (max-width: 576px) {
  .collection {
    &-img {
      height: 200px;
    }
  }
}
</style>