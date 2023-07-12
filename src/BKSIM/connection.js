const config = require("./configuration")
const bksLog = require("./BKSLog")
const message = require("./message");
const cyToast = require("../utils/cyToast.js")
class Connection {
  constructor() {
    this.status = 'init';// init;connecting;open;close;error
    this.socketTask = null;
    this.onReceivedMessage = null;
    this.chatMsgOnReceived = null
    this.token = null;
    this.normalClose = false;
  }

  buildConnect(success) {
    if (this.socketTask || this.status === 'connecting' || this.status === 'open') {
      this.normalClose = true;
      this.socketTask.close({
        code: 5001,
        reason: "self-close"
      })
    }
    this.socketTask = wx.connectSocket({
      url: config.url,
      header: {
        'content-type': 'application/json'
      },
      method: "GET"
    })
    this.status = 'connecting'

    this.socketTask.onClose((info) => {
      bksLog.log("socketTask.onClose", info);
      this.status = 'close';
      this.clear();
      this.socketTask = null;
      if (info.code != 5001) {
        if (this.onError) {
          this.onError();
        }
      }

    })

    this.socketTask.onError(info => {
      console.log("this.socketTask", this.socketTask)
      bksLog.log("socketTask.onError", info);
      this.status = 'error';
      this.clear();
      if (this.onError) {
        this.onError();
      }
    })
    this.socketTask.onOpen(info => {
      this.normalClose = false
      ///console.log("this.socketTask", this.socketTask)
      bksLog.log("socketTask.onOpen", info);
      this.status = 'open';
      this.beginBeat();
      if (this.onOpen) {
        this.onOpen();
      }
      if (success) {
        success();
      }
    })
    this.socketTask.onMessage(info => {
      // bksLog.log("socketTask.onMessage",JSON.parse(info.data));
      let body = JSON.parse(info.data)
      bksLog.log("socketTask.onMessage", body);

      if (body.inMsg && body.inMsg.msgId && body.action && (body.action !== 104 && body.action !== 103 && body.action !== 108)) {
        this.sendMessage(message.generateReceipt(body.inMsg.msgId));
      }

      // 发送的聊天消息接收回执
      if (body.action == 103) {
        if (this.chatMsgOnReceived) {
          this.chatMsgOnReceived(body);
        }
        return;
      }


      if (this.onReceivedMessage && typeof this.onReceivedMessage === 'function') {
        // 通知类型消息
        if (body.action === 109) {

          body = message.fetchNotificationMessage(body);
        }

        if (body.action === 102) {
          body = message.fetchChatMessageMessage(body);
        }

        if (body.action == 107) {
          body = message.fetchGroupChatMessageMessage(body);
        }

        this.onReceivedMessage(body);
      }
    })
  }

  // 开启心跳包
  beginBeat() {
    if (this.beatTimer) {
      clearInterval(this.beatTimer);
    }
    this.beatTimer = setInterval(() => {
      if (this.socketTask) {
        this.socketTask.send({
          data: JSON.stringify(message.generateBeatPackage()),
          success: (info) => {
            bksLog.log("socketTask.sendBeat:Success", info);
          },
          fail: (info) => {
            bksLog.log("socketTask.sendBeat:Fail", info);
          }
        })
      }
    }, 60000)
  }
  // 链接关闭，关闭心跳包
  clear() {
    if (this.beatTimer) {
      clearInterval(this.beatTimer);
    }

  }

  // 主动断连
  disconnect() {
    if (this.status === 'open' && this.socketTask) {
      this.socketTask.close({
        code: 5001,
        reason: "self-close"
      });
      this.status == 'close'
      this.clear();
      ;
    }
  }

  // 发送消息
  sendMessage(msg, success, fail) {
    if (this.status === 'open') {
      bksLog.log("socketTask.sendMessage", msg);
      this.socketTask.send({
        data: JSON.stringify(msg),
        success: success,
        fail: fail
      })
    } else {
      if (fail) {
        fail(' this.socketTask:status is not open')
      }
    }

  }

  login(token) {
    this.sendMessage(message.generateLoginMsg(token));
  }
  logout() {
    this.sendMessage(message.generateLogoutMsg());
  }



}

let cnt = new Connection();


export default cnt