(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-aa25501e"],{"03ea":function(e,t,s){},"8ce4":function(e,t,s){"use strict";s.r(t);var o=function(){var e=this,t=e._self._c;return t("div",{staticStyle:{width:"100%",height:"100%"}},[t("full-loading",{ref:"fullLoading"}),t("div",{attrs:{id:"pano"}}),e.readyStatus&&e.krpano?t("div",[t("scene-logo",{attrs:{scene:e.scene}}),t("full-screen"),t("bgc-music",{attrs:{musicSrc:e.scene.Sound}}),t("scene-roate"),t("scene-share",{attrs:{scene:e.scene}}),t("hot-spot",{ref:"hotSpot"}),t("designer-info",{attrs:{designer:e.designer}}),t("div",{staticClass:"n-screen",on:{click:function(t){e.dialogVisible=!0}}},[e._v("多屏联动")]),e._m(0)],1):e._e(),t("error-tip",{ref:"error"}),t("Modal",{attrs:{title:"多屏联动","footer-hide":"",closable:!1,"mask-closable":!1},model:{value:e.dialogVisible,callback:function(t){e.dialogVisible=t},expression:"dialogVisible"}},[t("RadioGroup",{attrs:{vertical:""},model:{value:e.vertical,callback:function(t){e.vertical=t},expression:"vertical"}},[t("Radio",{attrs:{label:"controler",size:"large"}},[t("Icon",{attrs:{type:"social-android"}}),t("span",[e._v("我是演示方")])],1),t("Radio",{attrs:{label:"viewer"}},[t("Icon",{attrs:{type:"social-windows"}}),t("span",[e._v("我是观看方")])],1),t("Button",{staticStyle:{width:"240px",margin:"22px auto 0"},attrs:{type:"primary",target:"_blank"},on:{click:function(t){return t.preventDefault(),e.expression.apply(null,arguments)}}},[e._v("开始体验")])],1)],1),t("Modal",{attrs:{title:"","footer-hide":"",closable:!1,"mask-closable":!1},model:{value:e.infoVisible,callback:function(t){e.infoVisible=t},expression:"infoVisible"}},[t("div",{staticClass:"codeNum"},[e._v("05038808")]),t("div",{staticClass:"codeWord"},[e._v(" 请将识别码发送给演示对象， 对方输入确认后即可开始演示 ")]),t("Button",{staticStyle:{width:"240px","margin-top":"28px"},attrs:{type:"primary",target:"_blank"},on:{click:function(t){return t.preventDefault(),e.copy.apply(null,arguments)}}},[e._v("复制识别码")])],1),t("Modal",{attrs:{title:"输入识别码",closable:!1,"mask-closable":!1},model:{value:e.viewVisible,callback:function(t){e.viewVisible=t},expression:"viewVisible"}},[t("div",[e._v("输入由演示方生成的识别码，确认后即可开始观看演示")]),t("Input",{staticStyle:{width:"200px","margin-top":"11px"},attrs:{clearable:"",placeholder:"输入识别码"},model:{value:e.GroupID,callback:function(t){e.GroupID=t},expression:"GroupID"}})],1)],1)},i=[function(){var e=this,t=e._self._c;return t("div",{staticClass:"multi-controller-panel pc"},[t("ul",{staticClass:"clearfix"},[t("li",{staticClass:"copy-group-id"},[t("a",{staticClass:"group-id",attrs:{href:"javascript:;",title:"复制识别码"}},[e._v("识别码："),t("i",[e._v("06270470 复制 ")])])]),t("li",{staticClass:"controller"},[e._v("当前控制数："),t("span",{staticClass:"count"},[e._v("0")])]),t("li",[t("a",{staticClass:"button-close",attrs:{href:"javascript:;",title:"结束控制"}},[e._v("结束演示")])])])])}],a=s("4ec3"),n=s("90fe"),l=s("e294"),r=s("d006"),c=s("95bf"),d=s("9f44"),p=s("d683"),h=s("f178"),u=s("299e"),g=s("c300"),v=s("5c59"),f=s("65f2"),w=s.n(f),b={name:"VPano",components:{FullLoading:l["a"],FullScreen:r["a"],BgcMusic:c["a"],SceneRoate:d["a"],SceneShare:p["a"],ErrorTip:g["a"],SceneLogo:h["a"],HotSpot:u["a"],DesignerInfo:v["a"]},data(){return{avatar:w.a,taskId:"",scene:{},krpano:null,readyStatus:!1,xmlstr:"",designer:{portrait:w.a,id:"",name:"设计师",shopName:"",phone:" ",orderUrl:"https://www.oppein.cn/site/app",orderUrlM:"https://m.oppein.cn/site/app",designerBarStatus:!1,tenant_id:"",pageView:0,Language:""},dialogVisible:!1,vertical:"",infoVisible:!1,viewVisible:!0,GroupID:"",ws:null,WebSocketsExist:""}},created(){const e=window.location.href;this.taskId=Object(n["a"])(e,"taskId"),this.initialWebSocket()},mounted(){this.$refs.fullLoading.visible=!0,this.getInfo()},methods:{getInfo(){Object(a["a"])({taskId:this.taskId}).then(e=>{if(console.log("res",e),e.IsSuccess&&e.SuccessReturn){this.scene=e.SuccessReturn,this.scene.formatterXml=formatXml(this.scene.TourXml),this.xmlstr=formatXml(e.SuccessReturn.TourXml),this.initKrpano(this.scene.formatterXml);const t=e.SuccessReturn;t.DesignnerHeadImg&&(this.designer.portrait=t.DesignnerHeadImg),"OPL"===t.Brand&&(this.designer.orderUrl="http://www.oppolia.com",this.designer.orderUrlM="http://www.oppolia.com"),this.designer.id=t.Cid,this.designer.name=t.DesignerName||"设计师",this.designer.phone=t.DesignerTel||"",this.designer.shopName=t.ShopName||"",this.designer.tenant_id=t.tenant_id||"",this.designer.Language=t.Language||"",this.designer.pageView=t.count?t.count:0}}).catch(e=>{})},initKrpano(e){let t=this;const s={target:"pano",xml:null,html5:"auto",passQueryParameters:!0,onready:function(e){e.call("loadxml("+t.xmlstr+")"),t.ready(),t.krpanoReady(e)}};embedpano(s)},ready(){this.krpano=document.getElementById("krpanoSWFObject"),this.$root.krpano=document.getElementById("krpanoSWFObject"),setInterval(()=>{this.$refs.fullLoading&&(this.$refs.fullLoading.visible=!1,this.$refs.fullLoading.percent=100),this.readyStatus=!0},1e3),this.krpano.call("skin_setup_littleplanetintro1")},showError(e){this.$refs.fullLoading.visible=!1,this.$refs.fullLoading.percent=100,this.$refs.error.visible=!0,this.$refs.error.msg=e.msg,this.$refs.error.data=e.data},initHot(){this.$refs.hotSpot.initHot()},IntervalSendMessage(){var e=this.krpano;if(console.log("krpano",e),e&&e.get){var t=e.get("view.hlookat"),s=e.get("view.vlookat"),o=e.get("view.fov"),i=e.get("xml.scene"),a={hlookat:t,vlookat:s,fov:o,scene:i};console.log("krObj",a),console.log(this.ws," this.ws"),1===this.ws.readyState&&(console.log(JSON.stringify(a)),this.ws.send(JSON.stringify(a)))}},i(){let e={hlookat:-59.95619140592913,vlookat:7.455078649912778,fov:95,scene:"panoe247e19c-4588-4ce0-a4d8-120c8a5da7c9"};var t=e.hlookat,s=e.vlookat,o=e.fov,i=e.scene,a=this.krpano;a&&a.set&&(a.call("loadscene(get(scene_04), null, MERGE);"),a.set("view.hlookat",t),a.set("view.vlookat",s),a.set("view.fov",o),a.get("xml.scene")!==i&&a.call("loadscene("+i+", null, MERGE);"))},expression(){console.log("vertical",this.vertical),this.infoVisible=!0,this.dialogVisible=!1},copy(){console.log("复制识别码"),this.infoVisible=!1;var e=this,t=new Clipboard(".btn");t=new this.Clipboard(".btn");t.on("success",s=>{e.$Message.info("复制成功"),t.destroy()}),t.on("error",s=>{e.$Message.info("该浏览器不支持自动复制"),t.destroy()})},krpanoReady(e){console.log("krpano",e),e.call("trace(krpano is ready...)"),e.call("loadscene(scene_04, null, MERGE);")},initialWebSocket(){var e=this.WebSocketsExist;e=!0;try{this.ws=new WebSocket("ws://183.56.204.212:2718/ws/12345678910"),console.log("this.ws",this.ws)}catch(t){console.log(t);try{this.ws=new MozWebSocket("ws://183.56.204.212:2718/ws/12345678910"),console.log("this.ws",this.ws)}catch(t){e=!1}}e?(console.log("The current browser support websocket!"),this.ws.onopen=this.WSonOpen,this.ws.onmessage=this.WSonMessage,this.ws.onclose=this.WSonClose,this.ws.onerror=this.WSonError):console.log("The current browser not support websocket!")},WSonOpen(){console.log("websocket opened success!"),setInterval(this.IntervalSendMessage,50)},WSonMessage(e){console.log(e.data),console.log("received: %s",e.data),this.reset(e)},WSonClose(){console.log("Websocket closed.")},WSonError(){console.log("Websocket error occur.")},reset(e){console.log("重置",this.vertical);var t=JSON.parse(e.data),s=t.hlookat,o=t.vlookat,i=t.fov,a=t.scene,n=document.getElementById("krpanoSWFObject");n&&n.set&&"viewer"==this.vertical&&(n.call("loadscene(get(scene_04), null, MERGE);"),n.set("view.hlookat",s),n.set("view.vlookat",o),n.set("view.fov",i),n.get("xml.scene")!==a&&n.call("loadscene("+a+", null, MERGE);"))}}},k=b,m=(s("dd85"),s("2877")),S=Object(m["a"])(k,o,i,!1,null,"31bb359d",null);t["default"]=S.exports},dd85:function(e,t,s){"use strict";s("03ea")}}]);