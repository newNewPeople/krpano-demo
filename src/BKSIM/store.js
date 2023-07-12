const message = require("./message");
const conversationStoreKeyPrefix = `bksim-cvs-`;
const unreadNumStoreKey = 'bksim-unread-num'
const imStoreKeysKey = 'bksim-store-keys' 
const imStoreCVSIdKeys = 'bksim-store-cvsids-keys';
const imClientId = 'bksim-store-im-client-id';

function uuidv4() {
    function S4() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}
class IMStore {
    constructor(){

        this.chatConversationsIndexs = [];
        this.conversationList = {}; 
        this.messagesDict= {};
        this.unreadNum = wx.getStorageSync(unreadNumStoreKey) || 0;
        this.conversationIds = [];
        this.conversationIds = wx.getStorageSync(imStoreKeysKey) || [];
        this.clientId = wx.getStorageSync(imClientId);
        if(!this.clientId){
            this.clientId = uuidv4();

            wx.setStorage({
                key: imClientId,
                data: this.clientId,
            })
           
        }
    }

    getConversationId(chatUserId){
        return `${conversationStoreKeyPrefix}${chatUserId}`;
    }
    getConversionMsgKey(cvsId){
        return `${cvsId}-msgs`
    }

    addMsg(cvsId,msg){
        let msgKey = this.getConversionMsgKey(cvsId);
        let messages = this.messagesDict[msgKey];
        if(messages){
            messages.push(msg);
        }else {
            messages = wx.getStorageSync(msgKey);
            messages = messages || [];
            messages.push(msg);
            this.messagesDict[msgKey] = messages;  
        }
        
        wx.setStorage({
            key:msgKey,
            data:messages
        })
        
        let index = this.conversationIds.indexOf(cvsId);
        if(index > 0){
            this.conversationIds.splice(index,1);
            let p = [cvsId];
            this.conversationIds =  p.concat(this.conversationIds);
        }else if(index < 0){
            let p = [cvsId];
            this.conversationIds = p.concat(this.conversationIds);
        }
        wx.setStorage({
            key: imStoreKeysKey,
            data: this.conversationIds,
        })
        
    }

    clearCVSMessage(cvsId){
        let msgKey = this.getConversionMsgKey(cvsId);
        this.messagesDict[msgKey] = [];

        wx.setStorage({
            key:msgKey,
            data:[]
        })
    }


    getConversationInfoWithId(cvsId){
        if(this.conversationList[cvsId]){
            return this.conversationList[cvsId];
        }else {
            let cvs = wx.getStorageSync(cvsId);
            if(cvs){
                
                this.conversationList[cvsId]  = cvs;
                return cvs;
            }else {
                this.recordNewCVSId(cvsId);
                return null;
            }
        }
    }
    
    recordNewCVSId(cvsId){
        if(this.conversationIds.indexOf(cvsId) < 0){
            let t = [cvsId]
            this.conversationIds = t.concat(this.conversationIds);
         
            wx.setStorage({
                key: imStoreKeysKey,
                data: this.conversationIds,
            })
        }
    
    }
    getConversationMsg(cvsId){
        let msgsKey = this.getConversionMsgKey(cvsId);
        return wx.getStorageSync(msgsKey);
    }

    saveConversationInfo(conversation){
        wx.setStorage({
            key:conversation.id,
            data:conversation
        })

    }

    clear(){
        
      
        for(let cvsId of this.conversationIds){
            wx.removeStorage({
                key: cvsId,
                success: function(res) {},
            })

            wx.removeStorage({
                key: this.getConversionMsgKey(cvsId),
                success: function(res) {},
            })
        }

        wx.removeStorage({
            key: imStoreKeysKey,
            success: function (res) { },
        })
        this.chatConversationsIndexs = [];
        this.conversationList = {};
        this.messagesDict = {};
        this.unreadNum = 0;
        this.conversationIds = [];
        console.log("已清理缓存")
    }

}

let imStore = new IMStore();

module.exports =  imStore;




