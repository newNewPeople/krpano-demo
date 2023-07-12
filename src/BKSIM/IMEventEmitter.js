class EventEmitter{
    constructor(){
        this.__envents = {}
    }

    on(event,callback){
        let callbacks = this.__envents[event] || []
        callbacks.push(callback)
        this.__envents[event] = callbacks
        console.log(">>>>emit:on",this.__envents,callbacks)
        return this
    }
    off(event,callback){
        let callbacks = this.__envents[event]
        this.__envents[event] = callbacks && callbacks.filter(fn => fn !== callback)
        return this
    }
    emit(...args){
        const event = args[0]
        const params = [].slice.call(args,1)
        const callbacks = this.__envents[event]
        console.log(">>>>emit",this.__envents,callbacks)
        if(Array.isArray(callbacks)){
            callbacks.forEach(fn => {
                try{
                    fn.apply(this,params)
                }catch(e){
                    console.error(e)
                }
                
            })
        }
        return this
    }
    once(event,callback){
        let wrapFanc = (...args) => {
            callback.apply(this,args)
            this.off(event,wrapFanc)
        }
        this.on(event,wrapFanc)
        return this
    }

}

let shared = new EventEmitter()
module.exports =    shared