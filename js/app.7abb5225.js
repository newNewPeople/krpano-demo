(function(e){function t(t){for(var r,o,c=t[0],i=t[1],s=t[2],l=0,d=[];l<c.length;l++)o=c[l],Object.prototype.hasOwnProperty.call(a,o)&&a[o]&&d.push(a[o][0]),a[o]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);f&&f(t);while(d.length)d.shift()();return u.push.apply(u,s||[]),n()}function n(){for(var e,t=0;t<u.length;t++){for(var n=u[t],r=!0,o=1;o<n.length;o++){var c=n[o];0!==a[c]&&(r=!1)}r&&(u.splice(t--,1),e=i(i.s=n[0]))}return e}var r={},o={app:0},a={app:0},u=[];function c(e){return i.p+"js/"+({"viewerjs.js":"viewerjs.js"}[e]||e)+"."+{"chunk-2d217eda":"e951d531","chunk-5a75b868":"bb220933","chunk-4275d91a":"6a2817d8","viewerjs.js":"1b18493e","chunk-7cc08b0a":"074fde8c","chunk-31ac3f7b":"e11f310b","chunk-aa25501e":"b99ae96d"}[e]+".js"}function i(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,i),n.l=!0,n.exports}i.e=function(e){var t=[],n={"chunk-4275d91a":1,"viewerjs.js":1,"chunk-7cc08b0a":1,"chunk-31ac3f7b":1,"chunk-aa25501e":1};o[e]?t.push(o[e]):0!==o[e]&&n[e]&&t.push(o[e]=new Promise((function(t,n){for(var r="css/"+({"viewerjs.js":"viewerjs.js"}[e]||e)+"."+{"chunk-2d217eda":"31d6cfe0","chunk-5a75b868":"31d6cfe0","chunk-4275d91a":"3bcb1359","viewerjs.js":"1cf0473b","chunk-7cc08b0a":"75cfc713","chunk-31ac3f7b":"68457534","chunk-aa25501e":"16ec4ad2"}[e]+".css",a=i.p+r,u=document.getElementsByTagName("link"),c=0;c<u.length;c++){var s=u[c],l=s.getAttribute("data-href")||s.getAttribute("href");if("stylesheet"===s.rel&&(l===r||l===a))return t()}var d=document.getElementsByTagName("style");for(c=0;c<d.length;c++){s=d[c],l=s.getAttribute("data-href");if(l===r||l===a)return t()}var f=document.createElement("link");f.rel="stylesheet",f.type="text/css",f.onload=t,f.onerror=function(t){var r=t&&t.target&&t.target.src||a,u=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");u.code="CSS_CHUNK_LOAD_FAILED",u.request=r,delete o[e],f.parentNode.removeChild(f),n(u)},f.href=a;var p=document.getElementsByTagName("head")[0];p.appendChild(f)})).then((function(){o[e]=0})));var r=a[e];if(0!==r)if(r)t.push(r[2]);else{var u=new Promise((function(t,n){r=a[e]=[t,n]}));t.push(r[2]=u);var s,l=document.createElement("script");l.charset="utf-8",l.timeout=120,i.nc&&l.setAttribute("nonce",i.nc),l.src=c(e);var d=new Error;s=function(t){l.onerror=l.onload=null,clearTimeout(f);var n=a[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),o=t&&t.target&&t.target.src;d.message="Loading chunk "+e+" failed.\n("+r+": "+o+")",d.name="ChunkLoadError",d.type=r,d.request=o,n[1](d)}a[e]=void 0}};var f=setTimeout((function(){s({type:"timeout",target:l})}),12e4);l.onerror=l.onload=s,document.head.appendChild(l)}return Promise.all(t)},i.m=e,i.c=r,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="",i.oe=function(e){throw console.error(e),e};var s=window["webpackJsonp"]=window["webpackJsonp"]||[],l=s.push.bind(s);s.push=t,s=s.slice();for(var d=0;d<s.length;d++)t(s[d]);var f=l;u.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"23be":function(e,t,n){},"33ec":function(e,t,n){},4360:function(e,t,n){"use strict";var r=n("2b0e"),o=n("5502");const a={videoStatus:e=>e.user.videoStatus};var u=a;const c={state:{videoStatus:!1},mutations:{setVideoStatus(e,t){e.videoStatus=t}}};var i=c;r["default"].use(o["a"]);const s=new o["a"].Store({modules:{user:i},getters:u});t["a"]=s},"56d7":function(e,t,n){"use strict";n.r(t);var r=n("2d48"),o=n("8144"),a=n("beb5"),u=n("5250"),c=n("fefa"),i=n("5953"),s=n("e3f5"),l=n("9259"),d=n("2b0e"),f=function(){var e=this,t=e._self._c;return e.isRouterAlive?t("div",{attrs:{id:"app"}},[t("router-view")],1):e._e()},p=[],h={name:"App",provide(){return{reload:this.reload}},data(){return{isRouterAlive:!0}},methods:{reload(){this.isRouterAlive=!1,this.$nextTick((function(){this.isRouterAlive=!0}))}}},b=h,v=(n("cbd3"),n("2877")),m=Object(v["a"])(b,f,p,!1,null,null,null),k=m.exports,g=n("8c4f");d["default"].use(g["a"]);const j=[{path:"/",redirect:"/pano",component:()=>Promise.all([n.e("viewerjs.js"),n.e("chunk-5a75b868"),n.e("chunk-7cc08b0a"),n.e("chunk-31ac3f7b")]).then(n.bind(null,"37f6"))},{path:"/tour",name:"Tour",component:()=>Promise.all([n.e("viewerjs.js"),n.e("chunk-5a75b868"),n.e("chunk-7cc08b0a"),n.e("chunk-31ac3f7b")]).then(n.bind(null,"37f6"))},{path:"/pano",name:"Pano",component:()=>Promise.all([n.e("viewerjs.js"),n.e("chunk-5a75b868"),n.e("chunk-7cc08b0a"),n.e("chunk-aa25501e")]).then(n.bind(null,"8ce4"))},{path:"/test",name:"test",component:()=>Promise.all([n.e("chunk-5a75b868"),n.e("chunk-4275d91a")]).then(n.bind(null,"2762"))},{path:"/socket",name:"socket",component:()=>n.e("chunk-2d217eda").then(n.bind(null,"c98f"))}],w=new g["a"]({mode:"history",base:"/tourview/",routes:j});w.beforeEach((e,t,n)=>{n()}),w.afterEach(e=>{});var y=w,P=n("4360"),S=(n("f8ce"),n("23be"),n("33ec"),n("b311")),O=n.n(S);d["default"].component("Modal",l["a"]),d["default"].component("Button",s["a"]),d["default"].component("Alert",i["a"]),d["default"].component("Progress",c["a"]),d["default"].component("Icon",u["a"]),d["default"].component("Input",a["a"]),d["default"].component("RadioGroup",o["a"]),d["default"].component("Radio",r["a"]),d["default"].config.productionTip=!1,d["default"].prototype.Clipboard=O.a,new d["default"]({router:y,store:P["a"],render:e=>e(k)}).$mount("#app")},"68ac":function(e,t,n){},cbd3:function(e,t,n){"use strict";n("68ac")}});