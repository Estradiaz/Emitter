/** should implement nodejs events into nativescript */

//@ts-ignore
export default class Emitter implements NodeJS.EventEmitter {
    static defaultMaxListeners: number = 10
    private _events: {
        [event: string]: Array<(...ars: any[]) => void>
        // [event: symbol]: (...ars: any[]) => void //not allowd in ts!!
    } = {}
    private _onceProxy: {
        [event: string]: Array<{listener: (...ars: any[]) => void, proxy:  (...ars: any[]) => void}>
        // [event: symbol]: (...ars: any[]) => void //not allowd in ts!!
    } = {}
    addListener(event: string | symbol, listener: (...ars: any[]) => void){

        //@ts-ignore
        if(!this._events[event]){
            //@ts-ignore
            this._events[event] = []
        }
        this.emit("newListener", event, listener)

        //@ts-ignore
        this._events[event]
        .push(listener)
        return this
    }
    emit(event: string | symbol, ...args: any[]){

        if(
            event in this._events
            //@ts-ignore
            && Array.isArray(this._events[event])
        ){
            //@ts-ignore
            if(this._events[event].length > Emitter.defaultMaxListeners){
                typeof console.warn === "function" 
                && console.warn("MaxListenersExceededWarning")
                || console.log("MaxListenersExceededWarning")
            }
            //@ts-ignore
            for(let cb of this._events[event]){
                cb(...args)
            }
            //@ts-ignore
            return this._events[event].length > 0
        }
        return false
    }
    eventNames(): Array<string | symbol> {

        return Object.entries(this._events)
        .map(x => x[1].length > 0 ? x[0] : false)
        .filter(x => x) as Array<string | symbol>
    }
    private _setMaxListeners?: number  = undefined
    getMaxListeners(): number{
        return this._setMaxListeners || Emitter.defaultMaxListeners
    }
    setMaxListeners(n: number){
        this._setMaxListeners = n
        return this
    }
    listenerCount(event: string | symbol){

        //@ts-ignore
        return event in this._events ? this._events[event].length : 0
    }
    listeners(event: string | symbol){

        //@ts-ignore
        return Array.isArray(this._events[event]) ?
        //@ts-ignore
        this._events[event].slice() : []
    }
    rawListeners(event: string | symbol){

        const rtn: Array<Function | Function & {listener: Function}> = []
        //@ts-ignore
        if(Array.isArray(this._events[event]))
        //@ts-ignore
        for(let fn of this._events[event]){

            //@ts-ignore
            let fn2 = (Array.isArray(this._onceProxy[event]) && this._onceProxy[event].find(x => x.proxy === fn) || {proxy: fn, listener: undefined})

            rtn.push(fn2.listener !== undefined && Object.assign(fn2.proxy, {listener: fn2.listener}) || fn)
        }
        return rtn
    }
    prependListener(event: string | symbol, listener: (...args: any[])=>void){

        //@ts-ignore
        if(!this._events[event]){
            //@ts-ignore
            this._events[event] = []
        }
        this.emit("newListener", event, listener)

        //@ts-ignore
        this._events[event] = [listener].concat(...this._events[event])
        return this
    }
    prependOnceListener(event: string | symbol, listener: (...args: any[]) => void){

        //@ts-ignore
        if(!this._onceProxy[event]){
            //@ts-ignore
            this._onceProxy[event] = []
        }
        const proxyStore = {
            listener, 
            proxy: (...args: any[])=>{
                
                listener(...args)
                this.removeListener(event, listener)
            }
        }
        this.emit("newListener", event, listener)
        //@ts-ignore
        this._onceProxy[event] = [proxyStore]
        //@ts-ignore
        .concat(...this._onceProxy[event])
        return this.addListener(
            event,
            //@ts-ignore
            proxyStore.proxy
        )
        return this
    }
    once(event: string | symbol, listener: (...ars: any[]) => void){

        //@ts-ignore
        if(!this._onceProxy[event]){
            //@ts-ignore
            this._onceProxy[event] = []
        }
        this.emit("newListener", event, listener)
        const proxyStore = {
            listener, 
            proxy: (...args: any[])=>{
                
                listener(...args)
                this.removeListener(event, listener)
            }
        }
        
        //@ts-ignore
        this._onceProxy[event]
        .push(proxyStore)
        return this.addListener(
            event,
            //@ts-ignore
            proxyStore.proxy
        )
    }
    on(event: string | symbol, listener: (...ars: any[]) => void){

        return this.addListener(event, listener)
    }
    removeListener(event: string | symbol, listener: (...ars: any[]) => void){

        let proxyStore
        //@ts-ignore
        if(Array.isArray(this._onceProxy[event])){
            //@ts-ignore
            for(let i = this._onceProxy[event].length - 1;i>=0;i--){
                //@ts-ignore
                if(this._onceProxy[event][i].listener === listener){
                    //@ts-ignore
                    proxyStore = this._onceProxy[event].splice(i, 1)[0]
                }
            }
        }
        let remListener
        //@ts-ignore
        if(Array.isArray(this._events[event])){
            //@ts-ignore
            for(let i = this._events[event].length - 1;i>=0;i--){
                //@ts-ignore
                if(this._events[event][i] === proxyStore && proxyStore.listener || listener){
                    //@ts-ignore
                    remListener = this._events[event].splice(i, 1)[0]
                }
            }
        }
        this.emit("removeListener", event, remListener)
        return this
    }
    removeAllListeners(event?: string | symbol){
        this._events = {}
        this._onceProxy = {}
        
        return this
    }
    off(event: string | symbol, listener: (...ars: any[]) => void){

        return this.removeListener(event, listener)
    }
}