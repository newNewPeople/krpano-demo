(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-31ac3f7b"],{"37f6":function(e,t,s){"use strict";s.r(t);var n=function(){var e=this,t=e._self._c;return t("div",{staticStyle:{width:"100%",height:"100%"}},[t("full-loading",{ref:"fullLoading"}),t("div",{attrs:{id:"pano"}}),e.readyStatus&&e.krpano?t("div",[t("scene-logo",{attrs:{scene:e.scene}}),t("full-screen"),t("bgc-music",{attrs:{musicSrc:e.scene.Sound}}),t("scene-roate",{ref:"sceneRotate"}),t("scene-share",{attrs:{scene:e.scene}}),t("scene-change",{ref:"sceneChange",on:{initHot:e.initHot,rotateChange:e.rotateChange}}),t("hot-spot",{ref:"hotSpot",on:{initHot:e.initHot}}),t("designer-info",{attrs:{designer:e.designer}})],1):e._e(),t("error-tip",{ref:"error"})],1)},r=[],i=s("4ec3"),o=s("90fe"),a=s("e294"),c=s("d006"),l=s("95bf"),h=s("9f44"),u=s("d683"),d=function(){var e=this,t=e._self._c;return t("div",[t("div",{class:["scene-change"]},[t("single-btn",{attrs:{iconClass:"icon-cedaohang-mokuai",title:"房间切换",text:"房间"},nativeOn:{click:function(t){return t.stopPropagation(),e.handle.apply(null,arguments)}}})],1),e.listVisible?t("div",{staticClass:"mask",on:{click:function(t){e.listVisible=!1}}}):e._e(),t("div",{directives:[{name:"show",rawName:"v-show",value:e.listVisible,expression:"listVisible"}],class:["thumb_bg",e.listVisible?"list-show":"list-hide"]},[t("div",{ref:"box",staticClass:"thumb_box"},e._l(e.sceneList,(function(s,n){return t("div",{key:s.name,class:["thumb",e.currentSceneName==s.name?"thumb-white-border":"thumb-gray-border"],attrs:{index:n},on:{click:function(t){return e.changeScene(s.name)}}},[t("img",{attrs:{draggable:"false",src:s.thumburl}}),t("p",[e._v(e._s(s.title))])])})),0),t("div",{staticClass:"toleft",on:{click:function(t){return e.handleArrow("left")}}},[t("i",{staticClass:"iconfont icon-Arrowleft"})]),t("div",{staticClass:"toright",on:{click:function(t){return e.handleArrow("right")}}},[t("i",{staticClass:"iconfont icon-Arrowright"})])])])},p=[],g=s("58d0"),m={components:{SingleBtn:g["a"]},data(){return{krpano:null,sceneList:[],currentSceneName:"",listVisible:!1}},props:{musicSrc:{type:String}},mounted(){const e=this;var t,s;this.krpano=document.getElementById("krpanoSWFObject"),this.currentSceneName=this.krpano.get("xml.scene"),this.sceneList=this.krpano.get("scene").getArray(),this.count=this.sceneList.length-1,this.beauty();const n=document.getElementsByClassName("thumb_box")[0];n.addEventListener("touchstart",(function(n){t=n.touches[0].clientX,s=e.$refs.box.scrollLeft}),!1),n.addEventListener("touchmove",(function(n){e.$refs.box.scrollLeft=s-n.touches[0].clientX+t}),!1)},methods:{handle(){this.listVisible=!this.listVisible},changeScene(e){if(e===this.currentSceneName)return;this.currentSceneName=e,this.krpano.call(`loadscene(${e}, null ,MERGE, BLEND(0.8))`),this.$emit("initHot");let t=this.krpano.get("autorotate.enabled");this.$emit("rotateChange",t),this.beauty()},handleArrow(e){this.$refs.box.scrollLeft="left"===e?this.$refs.box.scrollLeft-50:this.$refs.box.scrollLeft+50},beauty(){this.krpano=document.getElementById("krpanoSWFObject");let e=this.krpano.get("beauty.brightness");this.krpano.set("xml_color_r",1),this.krpano.set("xml_color_g",1),this.krpano.set("xml_color_b",1);let t=this.krpano.get("beauty.contrast"),s=this.krpano.get("beauty.saturation"),n=this.krpano.get("beauty.hue"),r=this.krpano.get("beauty.btype");switch(this.krpano.set("xml_brightness",e/100),this.krpano.set("xml_contrast",t/100),this.krpano.set("xml_saturation",s/100),this.krpano.set("xml_hue",n/100),r-0){case 0:this.krpano.set("xml_color_r",1),this.krpano.set("xml_color_g",1),this.krpano.set("xml_color_b",1);break;case 1:this.krpano.set("xml_color_b",.8),this.krpano.set("xml_color_r",1),this.krpano.set("xml_color_g",1);break;case 2:this.krpano.set("xml_color_r",1),this.krpano.set("xml_color_g",.8),this.krpano.set("xml_color_b",1);break;case 3:this.krpano.set("xml_color_r",.8),this.krpano.set("xml_color_g",.8),this.krpano.set("xml_color_b",.8);break}this.krpano.call("beauty_loop")}}},b=m,f=(s("8b8c"),s("2877")),k=Object(f["a"])(b,d,p,!1,null,"68b60edc",null),_=k.exports,S=s("f178"),w=s("299e"),x=s("c300"),v=s("5c59"),y=s("65f2"),L=s.n(y),$={name:"VPano",components:{FullLoading:a["a"],FullScreen:c["a"],BgcMusic:l["a"],SceneRoate:h["a"],SceneShare:u["a"],SceneChange:_,ErrorTip:x["a"],SceneLogo:S["a"],HotSpot:w["a"],DesignerInfo:v["a"]},data(){return{avatar:L.a,tourId:"",sceneId:"",scene:{},krpano:null,readyStatus:!1,designer:{portrait:L.a,id:"",name:"设计师",shopName:"",phone:" ",orderUrl:"https://www.oppein.cn/site/app",orderUrlM:"https://m.oppein.cn/site/app",designerBarStatus:!1,tenant_id:"",pageView:0,Language:""}}},created(){const e=window.location.href;this.tourId=Object(o["a"])(e,"tourId"),this.sceneId=Object(o["a"])(e,"sceneId")},mounted(){this.$refs.fullLoading.visible=!0,this.getInfo()},methods:{getInfo(){const e=this.tourId?i["c"]:i["b"];e({tourId:this.tourId}).then(e=>{if(console.log(e,"res"),e.IsSuccess&&e.SuccessReturn){this.scene=e.SuccessReturn;const t=e.SuccessReturn,s=Object(o["b"])();t.ShareEndDate&&s>t.ShareEndDate?this.showError({msg:"链接失效",data:"来晚了，当前场景的分享时间已到期"}):(this.initKrpano(this.scene.TourXml),t.DesignnerHeadImg&&(this.designer.portrait=t.DesignnerHeadImg),"OPL"===t.Brand&&(this.designer.orderUrl="http://www.oppolia.com",this.designer.orderUrlM="http://www.oppolia.com"),this.designer.id=t.Cid,this.designer.name=t.DesignerName||"设计师",this.designer.phone=t.DesignerTel||"",this.designer.shopName=t.ShopName||"",this.designer.tenant_id=t.tenant_id||"",this.designer.Language=t.Language||"",this.designer.pageView=t.count?t.count:0)}else this.showError({data:e.ErrorMessage||"任务异常，请联系管理员查看"})}).catch(e=>{this.showError({data:"任务异常，请联系管理员查看"})})},initKrpano(e){const t={target:"pano",xml:e,html5:"auto",mobilescale:1,showerrors:"false",passQueryParameters:!0,onready:this.ready};embedpano(t)},ready(){this.krpano=document.getElementById("krpanoSWFObject"),this.$root.krpano=document.getElementById("krpanoSWFObject"),setInterval(()=>{this.$refs.fullLoading&&(this.$refs.fullLoading.visible=!1,this.$refs.fullLoading.percent=100),this.readyStatus=!0},1e3),this.krpano.call("skin_setup_littleplanetintro1")},showError(e){this.$refs.fullLoading.visible=!1,this.$refs.fullLoading.percent=100,this.$refs.error.visible=!0,this.$refs.error.msg=e.msg,this.$refs.error.data=e.data},initHot(){this.$refs.hotSpot.initHot(),this.$refs.sceneChange.currentSceneName=this.krpano.get("xml.scene")},rotateChange(e){this.$refs.sceneRotate.rotateStatus=e}}},I=$,E=Object(f["a"])(I,n,r,!1,null,"649bbc91",null);t["default"]=E.exports},"8b8c":function(e,t,s){"use strict";s("d1b0")},d1b0:function(e,t,s){}}]);