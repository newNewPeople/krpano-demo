const config = require("./configuration")
const messageTypes = {

};
const messageActionTypes = {};
const localMsgTypes = {
    notification: 'notification',
    chatMessage: "chatMessage",
    groupChatMessage: "groupCahtMessage"
}
const imStore = require("./store")

function uuidv4() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

function generateAction(action, token, inMsg, extend) {
    return {
        action: action,
        uuid: uuidv4(),
        token: token || null,
        inMsg: inMsg || {},
        extend: extend || null,
        identity: config.platform
    }
}

function generateInMsg(msgType, content, extend) {
    return {
        msgType: msgType,
        receiverId: null,
        uuid: uuidv4(),
        msg: content || "",
        time: new Date().getTime(),
        seq: 1,
        isGroup: 0,
        extend: extend || null,

    }
}


const chatMsgTypes = {
    text: "text",
    image: "image",
    voice: 'voice',
    start: "start",
    end: "end", //问诊结束的消息
    drugend: "drugend", //药房门诊问诊结束的消息
    order: "order", // 问诊订单信息

    AVCall: "av-call", // 呼叫
    AVCallEcho: "av-call-echo", // 呼叫反馈,(有客户端收到了呼叫消息)
    AVCallRefused: "av-call-refused", // 呼叫 被对方拒绝
    AVCallEnd: "av-call-end", // 通话被挂断
    AVCallAgree: "av-call-agree", // 通话被接听
    AVCallBusy: "av-call-busy", // 通话正忙
    AVCallTimeout: "av-call-time-out", //通话无应答

}


class Message {
    constructor() {
        this.msgTypes = messageTypes;
        this.actionTypes = messageActionTypes;
        this.localMsgTypes = localMsgTypes;
        this.chatMsgTypes = chatMsgTypes;
        this.userTypes = {
            doctor: "doctor",
            patient: "patient"
        }
    }
    // messageBody 结构样例
    generateChatMessageBody(fromUserInfo, toUserInfo, chatMessageType, content, consultant, cardId, inquiryOrderId, doctorTitleName, drug, patientPrescriptionOrderId,video,audio) {
        console.log('cardId');
        console.log(cardId);
        console.log('inquiryOrderId');
        console.log(inquiryOrderId);
        let body = {
            from: {
                id: null,
                name: null,
                avatar: null,
                userType: "", // this.userTypes
            },
            to: {
                id: null,
                name: null,
                avatar: null
            },
            consultant: consultant || null,
            content: null,
            msgType: "", // this.chatMsgTypes
            uuid: uuidv4(),
        }
        console.log('fromUserInfo', fromUserInfo);
        body.from = fromUserInfo;
        body.to = toUserInfo;
        body.msgType = chatMessageType,
            body.content = content;
        body.date = new Date().getTime();

        //添加就诊人ID
        body.cardId = cardId;
        //添加订单ID
        body.inquiryOrderId = inquiryOrderId;
        //添加教学职称
        body.doctorTitle = doctorTitleName;
        //添加类型
        body.drug = drug;
        body.video = video
        body.audio = audio
        //添加处方ID
        body.patientPrescriptionOrderId = patientPrescriptionOrderId;
        console.log('body');
        console.log(body);

        return body;
    }

    // 单聊 action
    generateChatAction(msgBody) {
        let inMsg = generateInMsg(201);
        inMsg.receiverId = msgBody.to.id;
        inMsg.receiver = msgBody.to.userType === this.userTypes.doctor ? 501 : 502;
        inMsg.body = msgBody;
        inMsg.uuid = msgBody.uuid;
        inMsg.cardId = msgBody.cardId;
        let action = generateAction(102)
        action.inMsg = inMsg;
        return action;
    }
    // 群聊 action
    generateGroupChatAction(msgBody) {
        let inMsg = generateInMsg(202);
        inMsg.groupId = msgBody.to.id;
        inMsg.body = msgBody;
        inMsg.uuid = msgBody.uuid;
        let action = generateAction(107)
        action.inMsg = inMsg;
        return action;
    }

    //  发送消息已读
    generateConfirmMsgRead(token, msgIds) {
        return generateAction(108, token, null, msgIds.toString())
    }

    // 生产登录消息体
    generateLoginMsg(token) {
        return generateAction(101, token, null, imStore.clientId);
    }
    // 退出登录
    generateLogoutMsg() {
        return generateAction(106)
    }

    //  生产心跳包消息体
    generateBeatPackage() {
        return generateAction(105)
    }

    // 生产回执消息体
    generateReceipt(msgId) {
        return generateAction(103, null, null, msgId);
    }

    // 解析通知类型消息
    fetchNotificationMessage(actionMsg) {
        return {
            ...actionMsg.inMsg,
            localType: localMsgTypes.notification,
            receive_timestamp: new Date().getTime()
        }
    }
    // 解析聊天消息
    fetchChatMessageMessage(actionMsg) {
        console.log
        if (actionMsg.inMsg && actionMsg.inMsg.msgId) {
            let inMsg = actionMsg.inMsg;
            let body = inMsg.body || {};
            body.to = body.to || {};
            body.to.isMine = true;
            body.from.isMine = false
            body.msgId = inMsg.msgId;
            body.localType = localMsgTypes.chatMessage
            body.receive_timestamp = new Date().getTime();
            return body;
        }

        return {};
    }
    // 解析群聊聊天消息
    fetchGroupChatMessageMessage(actionMsg) {
        if (actionMsg.inMsg && actionMsg.inMsg.msgId) {
            let inMsg = actionMsg.inMsg;
            let body = inMsg.body || {};
            body.to = body.to || {};
            body.to.isMine = true;
            body.from.isMine = false;

            body.msgId = inMsg.msgId;
            body.localType = localMsgTypes.groupChatMessage
            body.receive_timestamp = new Date().getTime();
            if (body.to && body.to.userType === 'group') {
                body.groupInfo = {
                    ...body.to
                }
            } else if (body.from && body.from.userType === 'group') {
                body.groupInfo = {
                    ...body.from
                }
            } else {
                body.groupInfo = {};
            }
            return body;
        }

        return {};
    }
}

let message = new Message();
module.exports = message;