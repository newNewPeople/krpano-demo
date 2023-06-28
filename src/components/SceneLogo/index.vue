<!-- logo部件 -->
<template>
  <div
    class="logo-div"
    v-if="logoArr.length"
  >
    <div
      v-for="(item, index) in logoArr"
      :key="index"
      style="display: inline-block"
    >
      <img v-show="item.show !== 0" :src="item.url" alt="" />
    </div>
  </div>
</template>

<script>
import { getQueryString } from "@/libs/utils";
import { getBrandLogoCodeList } from '@/api/api'
export default {
  name: "SceneLogo",
  props: {
    scene: {},
  },
  data() {
    return {
      logoArr: [],
    }
  },
  created() {
    let logoName = getQueryString(window.location.href, "brandLogoCode")
    if(logoName) {
      const arr = []
      let logoNamesplit = logoName.split(',')
      getBrandLogoCodeList().then(res => {
        logoNamesplit.map(val => {
          let obj = res.data.find(item => item.brandLogoCode == val)
          if(obj) {
            let objTransform = {
              'url': obj.logoUrl4K,
              'show': 1
            }
            arr.push(objTransform)
          }
        })
      })
      this.logoArr = arr
    } else {
      // 需要隐藏品牌
		  let BrandHidden = this.scene.BrandHidden 
                      ? this.scene.BrandHidden.split('|')
                      : []
      //  将需要隐藏的品牌的show属性置为0 
		  BrandHidden.map(item => {
		  	for (let i = 0; i < this.scene.brandLogo.length; i++){
		  		if(item == this.scene.brandLogo[i].brand) {
		  		  this.scene.brandLogo[i].show = 0
		  		  break;
		  	  }
		  	}
      })
      this.logoArr = this.scene && this.scene.brandLogo && this.scene.brandLogo.length ? this.scene.brandLogo : []
    }
  },
};
</script>

<style scoped>
.logo-div {
  margin-left: 0px;
  height: auto;
  position: fixed;
  top: 0;
  left: 5px;
  font-size: 14px;
  color: #fff;
}

.logo-div img {
  max-width: 100px;
}
</style>