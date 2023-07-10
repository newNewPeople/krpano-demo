<template>
    <div class="draw">
      <div class="drawTop" ref="drawTop" v-if="lineStep == lineNum">
        <div>
          <el-button type @click="resetAll">清空</el-button>
          <el-button type @click="repeal">撤销</el-button>
          <el-button type @click="canvasRedo">恢复</el-button>
          <el-button type @click="downLoad">下载</el-button>
        </div>
        <div style="width:22%">
          选择绘制类型:
          <el-radio-group v-model="type" size="medium">
            <el-radio-button
              v-for="(item,index) in typeOption"
              :key="index"
              :label="item.value"
              @click.native="radioClick(item.value)"
            >{{item.label}}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div style="width:15%">
          边框粗细:
          <el-slider v-model="lineWidth" :min="0" :max="10" :step="1" style="width:70%"></el-slider>
        </div>
        <div>
          线条颜色:
          <el-color-picker v-model="strokeStyle"></el-color-picker>
        </div>
        <div>
          文字颜色:
          <el-color-picker v-model="fontColor"></el-color-picker>
        </div>
        <div style="width:15%">
          文字大小:
          <el-slider v-model="fontSize" :min="14" :max="36" :step="2" style="width:70%"></el-slider>
        </div>
      </div>
      <div style="height: 100%;width: 100%;position:relative;">
        <div class="content"></div>
        <input v-show="isShow" type="text" @blur="txtBlue" ref="txt" id="txt"
               style="z-index: 9999;position: absolute;border: 0;background:none;outline: none;"/>
      </div>
    </div>
  </template>
   
  <script>
    export default {
      name: "callout",
    //   props: {
    //     imgPath:" undefined",
   
    //   },
      data() {
        return {
          imgPath:"https://hospfiles.deephealth.net/patient/avatar-default.png",
          isShow: false,
          canvas: "",
          ctx: "",
          ctxX: 0,
          ctxY: 0,
          lineWidth: 1,
          type: "T",
          typeOption: [
            {label: "线", value: "L"},
            {label: "矩形", value: "R"},
            {label: "箭头", value: "A"},
            {label: "文字", value: "T"},
          ],
          canvasHistory: [],
          step: 0,
          loading: false,
          fillStyle: "#CB0707",
          strokeStyle: "#CB0707",
          lineNum: 2,
          linePeak: [],
          lineStep: 2,
          ellipseR: 0.5,
          dialogVisible: false,
          isUnfold: true,
          fontSize: 24,
          fontColor: "#CB0707",
          fontFamily: '微软雅黑',
          img: new Image(),
        };
      },
      mounted() {
        let _this = this;
        let image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = this.imgPath;
        image.onload = function () {//图片加载完，再draw 和 toDataURL
          if (image.complete) {
            _this.img = image
            let content = document.getElementsByClassName("content")[0];
            _this.canvas = document.createElement("canvas");
            _this.canvas.height = _this.img.height
            _this.canvas.width = _this.img.width
            _this.ctx = _this.canvas.getContext("2d");
            _this.ctx.globalAlpha = 1;
            _this.ctx.drawImage(_this.img, 0, 0)
            _this.canvasHistory.push(_this.canvas.toDataURL());
            _this.ctx.globalCompositeOperation = _this.type;
            content.appendChild(_this.canvas);
            _this.bindEventLisner();
          }
        }
      },
      methods: {
        radioClick(item) {
          if (item != "T") {
            this.txtBlue()
            this.resetTxt()
          }
        },
        // 下载画布
        downLoad() {
          let _this = this;
          let url = _this.canvas.toDataURL("image/png");
          let fileName = "canvas.png";
          if ("download" in document.createElement("a")) {
            // 非IE下载
            const elink = document.createElement("a");
            elink.download = fileName;
            elink.style.display = "none";
            elink.href = url;
            document.body.appendChild(elink);
            elink.click();
            document.body.removeChild(elink);
          } else {
            // IE10+下载
            navigator.msSaveBlob(url, fileName);
          }
        },
        // 清空画布及历史记录
        resetAll() {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.canvasHistory = [];
          this.ctx.drawImage(this.img, 0, 0);
          this.canvasHistory.push(this.canvas.toDataURL());
          this.step = 0;
          this.resetTxt();
        },
        // 清空当前画布
        reset() {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.drawImage(this.img, 0, 0);
          this.resetTxt();
        },
        // 撤销方法
        repeal() {
          let _this = this;
          if (this.isShow) {
            _this.resetTxt();
            _this._repeal();
          } else {
            _this._repeal();
          }
   
        },
        _repeal() {
          if (this.step >= 1) {
            this.step = this.step - 1;
            let canvasPic = new Image();
            canvasPic.src = this.canvasHistory[this.step];
            canvasPic.addEventListener("load", () => {
              this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
              this.ctx.drawImage(canvasPic, 0, 0);
              this.loading = true;
            });
          } else {
            this.$message.warning("不能再继续撤销了");
          }
        },
        // 恢复方法
        canvasRedo() {
          if (this.step < this.canvasHistory.length - 1) {
            if (this.step == 0) {
              this.step = 1;
            } else {
              this.step++;
            }
            let canvasPic = new Image();
            canvasPic.src = this.canvasHistory[this.step];
            canvasPic.addEventListener("load", () => {
              this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
              this.ctx.drawImage(canvasPic, 0, 0);
            });
          } else {
            this.$message.warning("已经是最新的记录了");
          }
        },
        // 绘制历史数组中的最后一个
        rebroadcast() {
          let canvasPic = new Image();
          canvasPic.src = this.canvasHistory[this.step];
          canvasPic.addEventListener("load", () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.drawImage(canvasPic, 0, 0);
            this.loading = true;
          });
        },
        // 绑定事件,判断分支
        bindEventLisner() {
          let _this = this;
          let r1, r2; // 绘制圆形，矩形需要
          this.canvas.onmousedown = function (e) {
            console.log("onmousedown");
            if (_this.type == "L") {
              _this.createL(e, "begin");
            } else if (_this.type == "R") {
              r1 = e.layerX;
              r2 = e.layerY;
              _this.createR(e, "begin", r1, r2);
            } else if (_this.type == "A") {
              _this.drawArrow(e, "begin")
            } else if (_this.type == "T") {
              _this.createT(e, "begin")
            }
          };
          this.canvas.onmouseup = function (e) {
            console.log("onmouseup");
            if (_this.type == "L") {
              _this.createL(e, "end");
            } else if (_this.type == "R") {
              _this.createR(e, "end", r1, r2);
              r1 = null;
              r2 = null;
            } else if (_this.type == "A") {
              _this.drawArrow(e, "end")
            } else if (_this.type == "T") {
              _this.createT(e, "end")
            }
          };
   
        },
        // 绘制线条
        createL(e, status) {
          let _this = this;
          if (status == "begin") {
            _this.ctx.beginPath();
            _this.ctx.moveTo(e.layerX, e.layerY);
            _this.canvas.onmousemove = function (e) {
              console.log("onmousemove");
              _this.ctx.lineTo(e.layerX, e.layerY);
              _this.ctx.strokeStyle = _this.strokeStyle;
              _this.ctx.lineWidth = _this.lineWidth;
              _this.ctx.stroke();
            };
          } else if (status == "end") {
            _this.ctx.closePath();
            _this.step = _this.step + 1;
            if (_this.step < _this.canvasHistory.length - 1) {
              _this.canvasHistory.length = _this.step; // 截断数组
            }
            _this.canvasHistory.push(_this.canvas.toDataURL());
            _this.canvas.onmousemove = null;
          }
        },
        // 绘制矩形
        createR(e, status, r1, r2) {
          let _this = this;
          let r;
          if (status == "begin") {
            console.log("onmousemove");
            _this.canvas.onmousemove = function (e) {
              _this.reset();
              let rx = e.layerX - r1;
              let ry = e.layerY - r2;
   
              //保留之前绘画的图形
              if (_this.step !== 0) {
                let canvasPic = new Image();
                canvasPic.src = _this.canvasHistory[_this.step];
                _this.ctx.drawImage(canvasPic, 0, 0);
              }
   
              _this.ctx.beginPath();
              _this.ctx.strokeRect(r1, r2, rx, ry);
              _this.ctx.strokeStyle = _this.strokeStyle;
              _this.ctx.lineWidth = _this.lineWidth;
              _this.ctx.closePath();
              _this.ctx.stroke();
            };
          } else if (status == "end") {
            _this.rebroadcast();
            let interval = setInterval(() => {
              if (_this.loading) {
                clearInterval(interval);
                _this.loading = false;
              } else {
                return;
              }
              let rx = e.layerX - r1;
              let ry = e.layerY - r2;
              _this.ctx.beginPath();
              _this.ctx.rect(r1, r2, rx, ry);
              _this.ctx.strokeStyle = _this.strokeStyle;
              _this.ctx.lineWidth = _this.lineWidth;
              _this.ctx.closePath();
              _this.ctx.stroke();
              _this.step = _this.step + 1;
              if (_this.step < _this.canvasHistory.length - 1) {
                _this.canvasHistory.length = _this.step; // 截断数组
              }
              _this.canvasHistory.push(_this.canvas.toDataURL());
              _this.canvas.onmousemove = null;
            }, 1);
          }
        },
   
        //绘制箭头
        drawArrow(e, status) {
          let _this = this;
          if (status == "begin") {
            //获取起始位置
            _this.arrowFromX = e.layerX;
            _this.arrowFromY = e.layerY;
            _this.ctx.beginPath();
            _this.ctx.moveTo(e.layerX, e.layerY);
          } else if (status == "end") {
            //计算箭头及画线
            let toX = e.layerX;
            let toY = e.layerY;
            let theta = 30;
            let headlen = 10;
            let _this = this;
            let fromX = this.arrowFromX;
            let fromY = this.arrowFromY;
            // 计算各角度和对应的P2,P3坐标
            let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI,
            angle1 = (angle + theta) * Math.PI / 180,
            angle2 = (angle - theta) * Math.PI / 180,
            topX = headlen * Math.cos(angle1),
            topY = headlen * Math.sin(angle1),
            botX = headlen * Math.cos(angle2),
            botY = headlen * Math.sin(angle2);
            let arrowX = fromX - topX,
            arrowY = fromY - topY;
            _this.ctx.moveTo(arrowX, arrowY);
            _this.ctx.moveTo(fromX, fromY);
            _this.ctx.lineTo(toX, toY);
            arrowX = toX + topX;
            arrowY = toY + topY;
            _this.ctx.moveTo(arrowX, arrowY);
            _this.ctx.lineTo(toX, toY);
            arrowX = toX + botX;
            arrowY = toY + botY;
            _this.ctx.lineTo(arrowX, arrowY);
            _this.ctx.strokeStyle = _this.strokeStyle;
            _this.ctx.lineWidth = _this.lineWidth;
            _this.ctx.stroke();
   
            _this.ctx.closePath();
            _this.step = _this.step + 1;
            if (_this.step < _this.canvasHistory.length - 1) {
              _this.canvasHistory.length = _this.step; // 截断数组
            }
            _this.canvasHistory.push(_this.canvas.toDataURL());
            _this.canvas.onmousemove = null;
          }
        },
   
        //文字输入
        createT(e, status) {
          let _this = this;
          if (status == "begin") {
   
          } else if (status == "end") {
            let offset = 0;
            if (_this.fontSize >= 28) {
              offset = (_this.fontSize / 2) - 3
            } else {
              offset = (_this.fontSize / 2) - 2
            }
   
            _this.ctxX = e.layerX + 2;
            _this.ctxY = e.layerY + offset;
   
            let index = this.getPointOnCanvas(e);
            _this.$refs.txt.style.left = index.x + 'px';
            _this.$refs.txt.style.top = index.y - (_this.fontSize / 2) + 'px';
            _this.$refs.txt.value = '';
            _this.$refs.txt.style.height = _this.fontSize + "px";
            _this.$refs.txt.style.width = _this.canvas.width - e.layerX - 1 + "px",
              _this.$refs.txt.style.fontSize = _this.fontSize + "px";
            _this.$refs.txt.style.fontFamily = _this.fontFamily;
            _this.$refs.txt.style.color = _this.fontColor;
            _this.$refs.txt.style.maxlength = Math.floor((_this.canvas.width - e.layerX) / _this.fontSize);
            _this.isShow = true;
            setTimeout(() => {
              _this.$refs.txt.focus();
            })
          }
        },
        //文字输入框失去光标时在画布上生成文字
        txtBlue() {
          let _this = this;
          let txt = _this.$refs.txt.value;
          if (txt) {
            _this.ctx.font = _this.$refs.txt.style.fontSize + ' ' + _this.$refs.txt.style.fontFamily;
            _this.ctx.fillStyle = _this.$refs.txt.style.color;
            _this.ctx.fillText(txt, _this.ctxX, _this.ctxY);
            _this.step = _this.step + 1;
            if (_this.step < _this.canvasHistory.length - 1) {
              _this.canvasHistory.length = _this.step; // 截断数组
            }
            _this.canvasHistory.push(_this.canvas.toDataURL());
            _this.canvas.onmousemove = null;
          }
        },
        //计算文字框定位位置
        getPointOnCanvas(e) {
          let cs = this.canvas;
          let content = document.getElementsByClassName("content")[0];
          return {
            x: e.layerX + (content.clientWidth - cs.width) / 2,
            y: e.layerY
          };
        },
        //清空文字
        resetTxt() {
          let _this = this;
          _this.$refs.txt.value = '';
          _this.isShow = false;
        }
      }
    };
  </script>
   
  <style scope>
    * {
      box-sizing: border-box;
    }
   
    body,
    html,
    #app {
      overflow: hidden;
    }
   
    .draw {
      height: 100%;
      min-width: 420px;
      display: flex;
      flex-direction: column;
    }
   
    .content {
      flex-grow: 1;
      height: 100%;
      width: 100%;
    }
   
    .drawTop {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 5px;
      height: 52px;
    }
   
    .drawTop > div {
      display: flex;
      align-items: center;
      padding: 5px 5px;
    }
   
    div.drawTopContrllor {
      display: none;
    }
   
    @media screen and (max-width: 1200px) {
      .drawTop {
        position: absolute;
        background-color: white;
        width: 100%;
        flex-direction: column;
        align-items: flex-start;
        height: 30px;
        overflow: hidden;
      }
   
      .drawTopContrllor {
        display: flex !important;
        height: 30px;
        width: 100%;
        justify-content: center;
        align-items: center;
        padding: 0 !important;
      }
    }
  </style>
  