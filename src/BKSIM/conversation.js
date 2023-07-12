const imStore = require("./store.js");
import message from './message'
import dispatcher from './dispatcher'

class Conversation {

    constructor(chatUserId) {
        this.id = imStore.getConversationId(chatUserId);

        this.info = {
            id: this.id,
            unreadNum: 0,
            lastMsg: null,
        }
        let storeInfo = imStore.getConversationInfoWithId(this.info.id);
        if (storeInfo) {
            this.info = storeInfo;
        }
    }

    addMsg(msg, isRead) {
        this.info.lastMsg = msg;
        if (!isRead) {
            this.info.unreadNum += 1
        }
        imStore.addMsg(this.id, msg);
        this.sync();
    }

    getMsgList() {
        return imStore.getConversationMsg(this.id);
    }

    sync() {
        imStore.saveConversationInfo(this.info);
    }

    sendTextMsg(messageBody, success, fail) {
        messageBody.msgType = message.chatMsgTypes.text;
        this.addMsg(messageBody, true);
        let action = ''
        if (messageBody.to.userType == 'group') {
            action = message.generateGroupChatAction(messageBody);
        } else {
            action = message.generateChatAction(messageBody);
        }
        dispatcher.push(action, success, fail);
    }

    sendCallAgreeMsg(messageBody,success,fail){
        messageBody.msgType = message.chatMsgTypes.AVCallAgree;
        this.addMsg(messageBody, true);
        let action = ''
        if (messageBody.to.userType == 'group') {
            action = message.generateGroupChatAction(messageBody);
        } else {
            action = message.generateChatAction(messageBody);
        }
        dispatcher.push(action, success, fail);
    }


    sendCallMsg(messageBody,success,fail){
        messageBody.msgType = message.chatMsgTypes.AVCall;
        this.addMsg(messageBody, true);
        let action = ''
        if (messageBody.to.userType == 'group') {
            action = message.generateGroupChatAction(messageBody);
        } else {
            action = message.generateChatAction(messageBody);
        }
        dispatcher.push(action, success, fail);
    }

    sendCallEchoMsg(messageBody,success,fail){
        messageBody.msgType = message.chatMsgTypes.AVCallEcho;
        this.addMsg(messageBody, true);
        let action = ''
        if (messageBody.to.userType == 'group') {
            action = message.generateGroupChatAction(messageBody);
        } else {
            action = message.generateChatAction(messageBody);
        }
        dispatcher.push(action, success, fail);
    }


    sendCallBusyMsg(messageBody,success,fail){
        messageBody.msgType = message.chatMsgTypes.AVCallBusy;
        this.addMsg(messageBody, true);
        let action = ''
        if (messageBody.to.userType == 'group') {
            action = message.generateGroupChatAction(messageBody);
        } else {
            action = message.generateChatAction(messageBody);
        }
        dispatcher.push(action, success, fail);
    }


    sendCallEndMsg(messageBody,success,fail){
        messageBody.msgType = message.chatMsgTypes.AVCallEnd;
        this.addMsg(messageBody, true);
        let action = ''
        if (messageBody.to.userType == 'group') {
            action = message.generateGroupChatAction(messageBody);
        } else {
            action = message.generateChatAction(messageBody);
        }
        dispatcher.push(action, success, fail);
    }


    sendCallRefusedMsg(messageBody,success,fail){
        messageBody.msgType = message.chatMsgTypes.AVCallRefused;
        this.addMsg(messageBody, true);
        let action = ''
        if (messageBody.to.userType == 'group') {
            action = message.generateGroupChatAction(messageBody);
        } else {
            action = message.generateChatAction(messageBody);
        }
        dispatcher.push(action, success, fail);
    }



    sendCallTimeOutMsg(messageBody,success,fail){
        messageBody.msgType = message.chatMsgTypes.AVCallTimeout;
        this.addMsg(messageBody, true);
        let action = ''
        if (messageBody.to.userType == 'group') {
            action = message.generateGroupChatAction(messageBody);
        } else {
            action = message.generateChatAction(messageBody);
        }
        dispatcher.push(action, success, fail);
    }


    sendStartMsg(messageBody, success, fail) {
        messageBody.msgType = message.chatMsgTypes.start;
        // this.addMsg(messageBody, true);
        let action = message.generateChatAction(messageBody);
        dispatcher.push(action, success, fail);

    }

    sendEndMsg(messageBody, success, fail) {

        messageBody.msgType = message.chatMsgTypes.end;
        let action = message.generateChatAction(messageBody);
        dispatcher.push(action, success, fail);

    }

    sendDrugEndMsg(messageBody, success, fail) {
        console.log('messageBody');
        console.log(messageBody);
        messageBody.msgType = message.chatMsgTypes.drugend;
        let action = message.generateChatAction(messageBody);
        dispatcher.push(action, success, fail);

    }


    sendPicMsg(messageBody, success, fail) {
        messageBody.msgType = message.chatMsgTypes.image;
        this.addMsg(messageBody, true);
        let action = ''
        if (messageBody.to.userType == 'group') {
            action = message.generateGroupChatAction(messageBody);
        } else {
            action = message.generateChatAction(messageBody);
        }
        dispatcher.push(action, success, fail);
    }

    sendVoiceMsg(messageBody, success, fail) {
        messageBody.msgType = message.chatMsgTypes.voice;
        this.addMsg(messageBody, true);
        let action = ''
        if (messageBody.to.userType == 'group') {
            action = message.generateGroupChatAction(messageBody);
        } else {
            action = message.generateChatAction(messageBody);
        }
        dispatcher.push(action, success, fail);
    }

    clearCacheMessages() {
        imStore.clearCVSMessage(this.id);
    }

}

export default Conversation;