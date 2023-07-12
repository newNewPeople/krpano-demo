import connection from './connection'
const message = require("./message")
const imStore = require('./store.js')
import dispatcher from './dispatcher'
class WebIM {
  constructor() {
    this.onReceivedMessage = null;
    this.onReceivedNotification = null;
    this.token = null;
    this.onReceivedChatMessage = null;
    this.unreadNotificationNum = 0;
    this.unreadChatNum = 0;

  }

  confirmReadMessages(msgIds) {
    console.log(`confirmReadMessages`,msgIds)
    let action = message.generateConfirmMsgRead(this.token, msgIds);
    dispatcher.push(action, () => {

    }, () => {

    });
  }

  inactive() {
    connection.disconnect()
  }



  // 激活通道，断线重连
  active(token, success) {
    if (token) {
      this.token = token;
    }
    connection.buildConnect((info) => {
      if (this.reconnectTimer) {
        clearInterval(this.reconnectTimer);
      }
      if (this.token) {
        this.login(this.token);
      }
      if (success) {
        success();
      }
    });

    connection.onError = (isError) => {
      if (this.reconnectTimer) {
        clearInterval(this.reconnectTimer);
      }

      this.reconnectTimer = setInterval(() => {
        console.log('connection.onClose! Try to reactive connection again!')
        this.active();
      }, 1000)


    }
    connection.onReceivedMessage = (msg) => {
     /// console.log('connection.onReceivedMessage', msg)
      if (msg.localType === message.localMsgTypes.notification) {
        if (this.onReceivedNotification) {
          this.onReceivedNotification(msg);
        }
      }
      if (msg.localType === message.localMsgTypes.chatMessage) {
        if (this.onReceivedChatMessage) {
          this.onReceivedChatMessage(msg);
        }
      }

      if (msg.localType === message.localMsgTypes.groupChatMessage) {
        if (this.onReceivedChatMessage) {
          this.onReceivedGroupChatMessage(msg);
        }
      }
    }
  }

  login(token) {
    if (!token) {
      return console.log('webIM:login:fail:no token')
    }
    this.token = token;
    connection.login(token);
  }

  logout() {
    this.token = null;
    connection.logout();
    imStore.clear();
  }

}

let im = new WebIM();

export default im