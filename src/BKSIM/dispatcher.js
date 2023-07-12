import connection from './connection';

class Dispatcher {
    constructor() {
        this.container = [];
        this.token = null;
        this.timeoutTimer = null;
    }
    receiveMessage(message) {

    }


    push(message, success, fail) {
        let session = {
            success,
            fail,
            message: message
        }
        this.container.push(session);
        this.send()
    }
    next() {
        return this.container.length ? this.container[0] : null
    }

    send() {

        if (this.currentSession) {
            return;
        }
        let session = this.next();
        if (!session) {
            return
        }
        this.currentSession = session;
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
        }
        this.timeoutTimer = setTimeout(() => {
            clearTimeout(this.timeoutTimer);
            this.timeoutTimer = null;
            if (this.currentSession.fail) {
                this.currentSession.fail(session.message, 'time out');
            }
            this.container.splice(0, 1);
            this.currentSession = null;
            this.send()
        }, 6000);
        connection.sendMessage(session.message);
        // connection 接收到单聊消息
        connection.chatMsgOnReceived = (body)=>{
            if(body.inMsg && this.currentSession && body.inMsg.uuid == this.currentSession.message.inMsg.uuid){
                clearTimeout(this.timeoutTimer);
                this.timeoutTimer = null;
                if(this.currentSession.success){
                    this.currentSession.success(body.inMsg);
                }
                this.container.splice(0, 1);
                this.currentSession = null;
                this.send();
            }
        }
        // connection 接收到群聊消息
      connection.groupChatMsgOnReceived = (body) => {
        if (body.inMsg && this.currentSession && body.inMsg.uuid == this.currentSession.message.inMsg.uuid) {
          clearTimeout(this.timeoutTimer);
          this.timeoutTimer = null;
          if (this.currentSession.success) {
            this.currentSession.success(body.inMsg);
          }
          this.container.splice(0, 1);
          this.currentSession = null;
          this.send();
        }
      }

    }

}

let dispatcher = new Dispatcher()
export default dispatcher;