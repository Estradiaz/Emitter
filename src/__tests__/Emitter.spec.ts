import Emitter from "../index"

describe("NodeJS EventEmitter Polyfill for NativeScript", function(){

    let emitter = new Emitter()
    const newListenerEvent = jest.fn()
    let spyRemoveListener = jest.spyOn(emitter, "removeListener")
    let spyAddListener = jest.spyOn(emitter, "addListener")
    let spyEmit = jest.spyOn(emitter, "emit")
    beforeEach(function(){
        newListenerEvent.mockClear()
        emitter = new Emitter()
        spyRemoveListener = jest.spyOn(emitter, "removeListener")
        spyAddListener = jest.spyOn(emitter, "addListener")
        spyEmit = jest.spyOn(emitter, "emit")
    })

    describe("addListener", function(){
        let type= "addListener"

        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should have '_events' hashmap", function(){

            expect(emitter).toHaveProperty("_events")
            //@ts-ignore
            expect(typeof emitter._events).toBe("object")
        })
        it("should add an event", function(){

            emitter.addListener("eventName", ()=>null)
            //@ts-ignore
            expect(emitter._events).toHaveProperty("eventName")
            //@ts-ignore
            expect(Array.isArray(emitter._events["eventName"])).toBe(true)
            //@ts-ignore
            expect(emitter._events["eventName"].length).toBe(1)
        })
        it("should emit 'newListener' before a listener is added", function(){

            const fun = ()=>null
            emitter.addListener("eventName", fun)
            expect(spyEmit).toBeCalledTimes(1)
            expect(spyEmit).toBeCalledWith("newListener", "eventName",fun)
        })
    })
    describe("emit", function(){
        let type = "emit"

        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should call all registered events for a specific eventName", function(){

            const spyCB = jest.fn()
            emitter.on("A", spyCB)
            emitter.on("A", spyCB)
            emitter.emit("A", 1, 2, 3)

            expect(spyCB).toBeCalledTimes(2)
            expect(spyCB).toBeCalledWith(1,2,3)
        })
        it("should return true if event had listeners", function(){

            const spyCB = jest.fn()
            expect(emitter.emit("A")).toBe(false)
            emitter.on("A", spyCB)
            expect(emitter.emit("A")).toBe(true)
            emitter.off("A", spyCB)
        })
    })
    describe("eventNames", function(){
        let type = "eventNames"
        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should return array of names | symbols of events containing listeners", function(){

            const spy = jest.fn()
            emitter.on("A", spy)
            emitter.on("B", spy)
            emitter.on("C", spy)
            emitter.on("D", spy)
            expect(emitter.eventNames()).toEqual(
                [
                    "A",
                    "B",
                    "C",
                    "D",
                ]
            )
            emitter.off("C", spy)
            expect(emitter.eventNames()).toEqual(
                [
                    "A",
                    "B",
                    "D",
                ]
            )
        })
    })
    describe("getMaxListeners", function(){
        let type = "getMaxListeners"
        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should return max listener value set by 'setMaxListeners' or defaults to 'defaulMaxListeners'", function(){

            expect(emitter.getMaxListeners()).toBe(Emitter.defaultMaxListeners)
            emitter.setMaxListeners(12)
            expect(emitter.getMaxListeners()).toBe(12)

        })
    })
    describe("setMaxListeners", function(){
        let type = "setMaxListeners"
        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should set max listener limit for instance", function(){

            expect(emitter.getMaxListeners()).toBe(10)
            expect(emitter.setMaxListeners(12)).toEqual(emitter)
            expect(emitter.getMaxListeners()).toBe(12)
        })
    })
    describe("listenerCount", function(){
        let type = "listenerCount"
        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should return registered number of listeners for eventName", function(){

            const spy = jest.fn()
            //@ts-ignore
            expect(emitter[type]("A")).toBe(0)
            emitter.on("A", spy)
            //@ts-ignore
            expect(emitter[type]("A")).toBe(1)
            emitter.off("A", spy)
            //@ts-ignore
            expect(emitter[type]("A")).toBe(0)
        })
    })
    describe("listeners", function(){
        let type = "listeners"
        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should return registered number of listeners for eventName", function(){

            const spy = jest.fn()
            //@ts-ignore
            expect(emitter[type]("A")).toEqual([])
            emitter.on("A", spy)
            //@ts-ignore
            expect(emitter[type]("A")).toEqual([spy])
            emitter.off("A", spy)
            //@ts-ignore
            expect(emitter[type]("A")).toEqual([])
        })
    })
    describe("rawListeners", function(){
        let type = "rawListeners"
        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should return listeners and if once then wrapper with prop listener", function(){

            const spy = jest.fn()
            emitter.on("A", spy)
            emitter.once("B", spy)
            expect(emitter.rawListeners("A")).toEqual([spy])
            let rawListeners = emitter.rawListeners("B")
            //@ts-ignore
            expect(rawListeners[0].listener).toEqual(spy)
            //@ts-ignore
            rawListeners[0].listener()
            expect(spy).toBeCalledTimes(1)
            emitter.emit("B")
            expect(spy).toBeCalledTimes(2)
            emitter.emit("B")
            expect(spy).toBeCalledTimes(2)

        })
    })
    describe("once", function(){
        let type = "once"

        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should have '_onceProxy' hashmap", function(){

            expect(emitter).toHaveProperty("_onceProxy")
            //@ts-ignore
            expect(typeof emitter._onceProxy).toBe("object")
        })
        it("should add listener for one time call - then remove it", function(){

            const fun = jest.fn()
            emitter.once("eventName", fun)
            expect(spyAddListener).toBeCalledTimes(1)
            expect(fun).not.toBeCalled()
            emitter.emit("eventName")
            expect(fun).toBeCalledTimes(1)
            expect(spyRemoveListener).toBeCalledTimes(1)
            emitter.emit("eventName")
            expect(fun).toBeCalledTimes(1)
        })
        it("should be removeable without troiggering it once", function(){

            const fun = jest.fn()
            emitter.once("eventName", fun)
            expect(spyAddListener).toBeCalledTimes(1)
            expect(fun).not.toBeCalled()
            emitter.removeListener("eventName", fun)
            expect(spyRemoveListener).toBeCalledWith("eventName", fun)
            emitter.emit("eventName")
            expect(fun).not.toBeCalled()
        })
        it("should be remove by removeAllListeners", function(){

            const fun = jest.fn()
            emitter.once("eventName", fun)
            expect(spyAddListener).toBeCalledTimes(1)
            expect(fun).not.toBeCalled()
            emitter.removeAllListeners()
            emitter.emit("eventName")
            expect(fun).not.toBeCalled()

        })
        it("should emit 'newListener' event on add", function(){

            const spy2 = jest.fn()
            //@ts-ignore
            emitter[type]("A", spy2)
            expect(spyEmit).toBeCalledWith("newListener", "A", spy2)
        })

    })
    describe("on", function(){
        let type = "on"

        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should alias 'addListener'", function(){

            const fun = () => null
            emitter.on("eventName", fun)
            expect(spyAddListener).toBeCalledTimes(1)
            expect(spyAddListener).toBeCalledWith("eventName", fun)
        })
    })
    describe("prependListener", function(){
        let type = "prependListener"

        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should prepend listener to event", function(){

            let order: number[] = []
            const spy1 = jest.fn(() => order.push(1))
            const spy2 = jest.fn(() => order.push(2))
            emitter.on("A", spy1)
            emitter.prependListener("A", spy2)
            emitter.emit("A")
            expect(order).toEqual([2,1])
        })
        it("should emit 'newListener' event", function(){

            const spy2 = jest.fn()
            emitter.prependListener("A", spy2)
            expect(spyEmit).toBeCalledWith("newListener", "A", spy2)
        })
    })
    describe("prependOnceListener", function(){
        let type = "prependOnceListener"

        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should emit 'newListener' event", function(){

            const spy2 = jest.fn()
            emitter.prependOnceListener("A", spy2)
            expect(spyEmit).toBeCalledWith("newListener", "A", spy2)
        })

    })
    describe("removeListener", function(){
        let type = "removeListener"

        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should remove an event", function(){

            
            const spyFun = jest.fn()
            emitter.addListener(type, spyFun)
            //@ts-ignore
            expect(emitter._events).toHaveProperty(type)
            //@ts-ignore
            expect(Array.isArray(emitter._events[type])).toBe(true)
            //@ts-ignore
            expect(emitter._events[type].length).toBe(1)

            //test
            emitter.removeListener(type, spyFun)
            //@ts-ignore
            expect(emitter._events[type].length).toBe(0)
        })
        it("should fire 'removeListener' after a listener is removed", function(){

            const fun = jest.fn()
            emitter.addListener(type, fun)
            spyEmit.mockClear()
            emitter.removeListener(type, fun)
            expect(spyEmit).toBeCalledTimes(1)
            expect(spyEmit).toBeCalledWith("removeListener", type,fun)
            
            emitter.emit(type)
            expect(fun).not.toBeCalled()
        })
    })
    describe("off", function(){
        let type = "off"

        it(`should have instance method ${type}`, function(){
    
            expect(emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof emitter[type]).toBe("function")
        })
        it("should alias 'removeListener'", function(){

            const fun = () => null
            emitter.off("eventName", fun)
            expect(spyRemoveListener).toBeCalledTimes(1)
            expect(spyRemoveListener).toBeCalledWith("eventName", fun)
        })
    })
    describe("defaultMaxListeners", function(){
        let type = "defaultMaxListeners"
        it("should be static on EventEmitter", function(){

            expect(Emitter).toHaveProperty(type)
            //@ts-ignore
            expect(typeof Emitter[type]).toBe("number")
        })
        it("should stdout 'MaxListenersExceededWarning' when single type counts is greater than limit", function(){

            let spyConsole = jest.spyOn(console, "warn")
            let fun = jest.fn()
            for(let i = 0; i < Emitter.defaultMaxListeners; i++)
                emitter.addListener(type, fun)
            emitter.emit(type)
            expect(spyConsole).toBeCalledTimes(0)
            emitter.addListener(type, fun)
            emitter.emit(type)
            expect(spyConsole).toBeCalledTimes(1)
            expect(spyConsole).toBeCalledWith("MaxListenersExceededWarning")
        })
    })
})