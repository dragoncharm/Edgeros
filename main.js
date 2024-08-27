const WebApp = require('webapp')
const app = WebApp.createApp()
app.use(WebApp.static('./public'))
const bodyParser = require('middleware').bodyParser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())
console.inspectEnable = true

/*********************** Socket.IO start ************************/
const socketIO = require('./libs/socket_server')
const io = socketIO.init(app)
io.sockets.on('connection', (client) => {
	console.log(`socket client: ${client.id} connected`)
})
/*********************** Socket.IO end ************************/

const { devManager } = require('./libs/dev_manager')
devManager.init()
devManager.on('device-join', (dev) => {
	if (devManager.validDeviceSupport(dev.devid)) {
		socketIO.emitMessage('device-join', dev.devid)
	}
})
devManager.on('device-lost', (devid) => {
	socketIO.emitMessage('device-lost', devid)
})
devManager.on('message', (params) => {
	const { devid, msg } = params
	console.log('message: ', devid, msg)  //控制台输出
	
	socketIO.emitMessage('device-rtv', { devid, data: msg.data })  //重点，明天更新这个地方
})

/*********************** HTTP start ************************/
const deviceRoute = require('./routes/device')
app.use('/api/device', deviceRoute)							//设备路由前缀
/*********************** HTTP end **************************/

app.start()
require('iosched').forever()
