import imMessage from './message'
import Conversation from './conversation';
import imEventEmitter from "./IMEventEmitter";



function onRecvAudioAndVideoMsg(message, app) {

    console.log(`>>>>>onRecvAudioAndVideoMsg`, message, app.globalData)
    let callId = message.content.callId;
    let type = message.content.type;
    if (app.globalData.callBreak && app.globalData.callBreak[callId]) {
        // 通话已结束
        return;
    }
    switch (message.msgType) {
        case imMessage.chatMsgTypes.AVCall: {

            let orderId = message.content.orderId
            let currentAVId = app.globalData.currentAVId

            if (!currentAVId) {
                // TODO:核验订单是否有效，再push到音视频页面
                app.globalData.currentAVId = orderId
                app.globalData.callAVMessage = {
                    ...message
                }
                wx.navigateTo({
                    url: `/packageB/pages/rtc-live/rtc-live?role=calledor&type=${type}`,
                })
                sendCallEcho(message)
                return
            }
            // 正在音视频，而且是当前订单
            if (currentAVId == orderId) {
                sendCallEcho(message)
            } else {
                // 正在音视频，但和消息订单不一致
                sendCallBusy(message)
            }
            break;
        }
        case imMessage.chatMsgTypes.AVCallBusy: {
            imEventEmitter.emit(imMessage.chatMsgTypes.AVCallBusy, message);
            break;
        }
        case imMessage.chatMsgTypes.AVCallEcho: {
            imEventEmitter.emit(imMessage.chatMsgTypes.AVCallEcho, message);
            break
        }

        case imMessage.chatMsgTypes.AVCallRefused: {

            imEventEmitter.emit(imMessage.chatMsgTypes.AVCallRefused, message);
            break
        }

        case imMessage.chatMsgTypes.AVCallAgree: {

            imEventEmitter.emit(imMessage.chatMsgTypes.AVCallAgree, message);
            break
        }

        case imMessage.chatMsgTypes.AVCallEnd: {

            imEventEmitter.emit(imMessage.chatMsgTypes.AVCallEnd, message);
            break
        }

        case imMessage.chatMsgTypes.AVCallTimeout: {

            imEventEmitter.emit(imMessage.chatMsgTypes.AVCallTimeout, message);
            break
        }

        default:
            break;
    }

}


function sendCallEcho(callMessage) {

    let from = callMessage.to;
    from.isMine = true;
    let to = callMessage.from;
    to.isMine = false
    let cvsId = to.userType == "patient" ? "p" + to.id : to.userType == "doctor" ? "d" + to.id : to.id;
    let conversation = new Conversation(cvsId);

    let msgBody = imMessage.generateChatMessageBody(from, to, imMessage.chatMsgTypes.videoCallEcho, {
        orderId: callMessage.content.orderId,
        callId:callMessage.content.callId,
        type:callMessage.content.type
    },callMessage.consultant,callMessage.cardId,callMessage.content.orderId,null,null,null,callMessage.content.type == 'video',callMessage.content.type == 'audio');
    conversation.sendCallEchoMsg(msgBody, (message) => {
        console.log('消息发送成功', message)
    }, (message, error) => {
        console.log('消息发送失败', message)
    });
}


function sendCallBusy(callMessage) {

    let from = callMessage.to;
    from.isMine = true;
    let to = callMessage.from;
    to.isMine = false
    let cvsId = to.userType == "patient" ? "p" + to.id : to.userType == "doctor" ? "d" + to.id : to.id;
    let conversation = new Conversation(cvsId);

    let msgBody = imMessage.generateChatMessageBody(from, to, imMessage.chatMsgTypes.AVCallBusy, {
        orderId: callMessage.content.orderId,
        callId:callMessage.content.callId,
        type:callMessage.content.type
    },callMessage.consultant,callMessage.cardId,callMessage.content.orderId,null,null,null,callMessage.content.type == 'video',callMessage.content.type == 'audio');
    conversation.sendCallBusyMsg(msgBody, (message) => {
        console.log('消息发送成功', message)
    }, (message, error) => {
        console.log('消息发送失败', message)
    });

}

export {
    onRecvAudioAndVideoMsg
}