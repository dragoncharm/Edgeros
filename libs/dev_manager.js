const Device = require('device')
const EventEmitter = require('events')
console.inspectEnable = true

class Dev extends EventEmitter {
    constructor() {
        super()
        this._devMap = new Map([])
        this._ctlMap = new Map([])
        this.init()
    }

    init() {
        Device.list(false, (error, list) => {
            if (error) {
                console.error('Device list error:', error.message)
            } else {
                console.log(list)
                list.forEach(item => {
                    Device.info(item.devid, (error, info) => {
                        if (error) {
                            console.error('[Device.info]:', error)
                        } else {
                            console.info(info)
                            const dev = {
                                devid: item.devid,
                                label: info.alias || info.report.name,
                                type: info.report.type,
                                brand: info.report.vendor,
                                model: info.report.model
                            }
                            this._devMap.set(dev.devid, dev)
                            this.emit('device-info', dev)
                        }
                    })
                })
            }
        })

        // 设备上线
        Device.on('join', (devid, info) => {
            const dev = {
                devid,
                label: info.alias || info.report.name,
                type: info.report.type,
                brand: info.report.vendor,
                model: info.report.model
            }
            this._devMap.set(dev.devid, dev)
            console.info('Device join:', dev)
            this.emit('device-join', dev)
        })

        // 设备掉线
        Device.on('lost', (devid) => {
            console.warn('Device lost:', devid)
            this._devMap.delete(devid)
            this.destroyCtl(devid)
            this.emit('device-lost', { devid })
        })
    }

    // 构建设备控制对象
    generateCtl(devid) {
        const controller = new Device()
        const ctl = this.getCtl(devid)
        if (ctl) {
            return Promise.resolve(ctl)
        }
        return new Promise((resolve, reject) => {
            controller.request(devid, (error) => {
                if (error) {
                    reject(error)
                } else {
                    this._ctlMap.set(devid, controller)
                    controller.on('message', (msg) => {
                        try {
                            this.emit('message', { devid, msg })
                        } catch (error) {
                            console.warn(error.message)
                        }
                    })
                    resolve(controller)
                }
            })
        })

    }

    // 销毁控制器对象
    destroyCtl(devid) {
        const ctl = this._ctlMap.get(devid)
        if (ctl) {
            ctl.release()
            this._ctlMap.delete(devid)
        }
    }

    getDev(devid) {
        return this._devMap.get(devid)
    }

    getCtl(devid) {
        return this._ctlMap.get(devid)
    }

    getDeviceList() {
        return [...this._devMap.values()]
    }

    // 控制设备
    async control(devid, data) {
        let ctl = this.getCtl(devid)
        if (!ctl) {
            ctl = await this.generateCtl(devid)
        }
        return new Promise((resolve, reject) => {
            ctl.send(data, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    }

    validDeviceSupport(devid) {
        const dev = this.getDev(devid)
        if (dev) {
            if(dev.type === 'light.belt' && dev.brand === '核芯科技HXKJ' && dev.model === 'RGB-01')
                return 1
            if(1)
                return 1
        }
    }
}

module.exports.devManager = new Dev()