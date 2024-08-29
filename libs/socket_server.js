const Socket = require('socket.io')

let io // socket服务

/**
 * 初始化socket服务
 * @param {*} app Http服务
 * @returns socket服务io
 */
const init = (app) => {
    io = Socket(app, {
        allowUpgrades: true
    })
    return io
}

/**
 * 广播消息
 * @param {string} event 事件名
 * @param {*} data 参数
 */
const emitMessage = (event, data) => {
    if (io) {
        io.sockets.emit(event, data)
    } else {
        console.warn('socket io does not exist')
    }
}

/**
 * 向指定房间广播消息
 * @param {string} room 房间名
 * @param {string} event 事件名
 * @param {*} data 参数 
 */
const emitRoomMessage = (room, event, data) => {
    if (io) {
        io.sockets.to(room).emit(event, data)
    } else {
        console.warn('socket io does not exist')
    }
}

module.exports = {
    init,
    emitMessage,
    emitRoomMessage
}