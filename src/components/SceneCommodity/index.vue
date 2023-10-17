<template>
  <div>
    <div :class="['scene-commodity']">
      <!-- 按钮 -->
      <single-btn
        @click.native="handle"
        v-if="ShowCommodityList.length"
        :iconClass="'icon--shangpinxiangqing-gai'"
        title="商品清单"
        text="商品"
      ></single-btn>
    </div>    
    <!-- 商品清单列表 -->
    <div v-if="listVisible" class="mask" @click="listVisible = false"></div>
    <div :class="['commodity-wrap', listVisible ? 'list-show' : 'list-hide']">
      <happy-scroll
        size="6"
        :min-length-v="0.6"
        right
        bigger-move-h="start"
        smaller-move-h="end"
        color="rgba(197,200,206, .3)"
        opacity="1"
        resize
      >
      <div
        v-for="(item, index) in ShowCommodityList"
        :key="item.name"
        :index="index"
        class="commodity_inner"
        @click="commodityHandle(item)"
      >
        <div class='imgWrap' :title="item.productName">
          <img draggable="false" :class="[
          commodityId == item.zyId
            ? 'commodity-blue-border'
            : 'commodity-wite-border',
          ]" :src="item.imgUrl" />
          <p>{{ item.productName }}</p>
        </div>
      </div>
      </happy-scroll>
    </div>
    <!-- 综合热点 -->
    <spot-collection
      ref="spotCollection"
      @close2D="close2D"
      :current="spotCollection"
    ></spot-collection>
  </div>
</template>

<script>
import SingleBtn from "@/components/SingleButton";
import { isMobile, getQuery } from "@/libs/utils";
import { getTourProductListC } from "@/api/api";
import { HappyScroll } from 'vue-happy-scroll'
import SpotCollection from "@/components/HotSpot/components/SpotCollection.vue";
import 'vue-happy-scroll/docs/happy-scroll.css'

export default {
  components: {
    SingleBtn,
    'happy-scroll': HappyScroll,
    SpotCollection,
  },
  data() {
    return {
      listVisible: false,
      ShowCommodityList: [{},],
      commodityId: '', // 当前选中商品id
      taskId: '',
      spotCollection: { // 图文综合热点弹框对象
        title: '',
        videoUrl: '',
        audioUrl: '',
        compreName: '',
        compreDetail: '',
        imgArr: []
      },
    }
  },
  created() {
    this.krpano = document.getElementById("krpanoSWFObject");
  },
  mounted() {
    this.taskId = this.krpano.get('scene').getItem().taskid
    this.getTourProductList()
  },
  methods: {
    handle() {
      this.listVisible = !this.listVisible;
    },
    // 获取商品数据
    getTourProductList(){
      console.log(' 获取商品数据')
      let _this = this
      getTourProductListC({tourId: getQuery("tourId")||'', taskId: this.taskId}).then(res => {
        console.log('rees',res)
        if(res.Code == 0) {
          res.SuccessReturn.map(item => {
            item.detail = {
              "compreName": item.hotspotName ? item.hotspotName : '名称',
        	  "videoUrl": item.mp4Url ? item.mp4Url : '',
        	  "audioUrl": item.mp3Url ? item.mp3Url : '',
        	  "imgArr": item.imgUrlList ? item.imgUrlList : '',
        	  "compreDetail": item.text ? item.text : ''
            }
          })
          this.ShowCommodityList = res.SuccessReturn
          this.ShowHotspotList = res.SuccessReturn.filter(item => item.showHotspot == 0)
          let i = 0
          if (this.ShowHotspotList.length > 0) {
            let timer = setInterval(() => {
             let name = "spot_create_" + new Date().getTime();
             _this.krpano.call("addhotspot(" + name + ");");
             _this.krpano.call("hotspot[" + name + "].loadstyle('compre4')");
             _this.krpano.set("hotspot[" + name + "].ath", _this.ShowHotspotList[i].coordinateChange.split(',')[0]);
             _this.krpano.set("hotspot[" + name + "].atv", _this.ShowHotspotList[i].coordinateChange.split(',')[1]);
             _this.krpano.set("hotspot[" + name + "].id", _this.ShowHotspotList[i].id); //将商品id赋值给热点的id
             _this.krpano.set("hotspot[" + name + "].text", _this.ShowHotspotList[i].productName);
             _this.krpano.set("hotspot[" + name + "].hottype", '9');
             _this.krpano.set("hotspot[" + name + "].detail", JSON.stringify(_this.ShowHotspotList[i].detail));
             _this.krpano.get("hotspot[" + name + "]").onclick = function () {
              _this.showHotspotInfo(_this.krpano.get("hotspot[" + name + "]").detail);
             };
             i++;
             if(i >= this.ShowHotspotList.length) {
              clearInterval(timer)
             }
            }, 10)
          }
        }
      })
    },

    showHotspotInfo(value) {
      let val = JSON.parse(value)
       // 关闭背景音乐和语音播报
    //   document.getElementById('audio').pause()
    //   this.musicStatus = false
      this.spotCollection.title =  val.compreName
      this.spotCollection.videoUrl = val.videoUrl
      this.spotCollection.audioUrl = val.audioUrl
      this.spotCollection.compreName = val.compreName
      this.spotCollection.compreDetail = val.compreDetail
      this.spotCollection.imgArr = val.imgArr;
      this.$refs.spotCollection.visible = true;
    },
    // 点击商品列表事件
    commodityHandle(val) {
      return console.log('val',val)
      this.commodityId = val.zyId // 将当前选中商品边框变色
      let tarcoodinate = val.coordinateChange.split(',')
      let ath = Number(tarcoodinate[0]) 
      let atv = Number(tarcoodinate[1])
      let fov = this.krpano.get("view.fov");
      this.krpano.call(
        "moveto(" + ath + "," + atv + fov + ", tween(easeinoutquad, 1))"
      );
       // 关闭背景音乐和语音播报
        //   document.getElementById('audio').pause()
        //   this.musicStatus = false
      this.spotCollection.title =  val.detail.compreName
      this.spotCollection.videoUrl = val.detail.videoUrl
      this.spotCollection.audioUrl = val.detail.audioUrl
      this.spotCollection.compreName = val.detail.compreName
      this.spotCollection.compreDetail = val.detail.compreDetail
      this.spotCollection.imgArr = val.detail.imgArr;
      this.$refs.spotCollection.visible = true;
    },
    close2D(val) {
      this.$emit("close2D", val);
    },
  }
}
</script>
<style lang="less" scoped>
@import url("./index.less");
</style>