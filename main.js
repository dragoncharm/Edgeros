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
	if (devManager.validLightSupport(dev.devid)) {
		socketIO.emitMessage('lightbelt-join', dev.devid)
	}
	if (devManager.validCurtainSupport(dev.devid)) {
		socketIO.emitMessage('curtains-join', dev.devid)
	}
	if (devManager.validPlugSupport(dev.devid)) {
		socketIO.emitMessage('plug-join', dev.devid)
	}
	if (devManager.validSensorSupport(dev.devid)) {
		socketIO.emitMessage('env-join', dev.devid)
	}
	if (devManager.validSensorCH4Support(dev.devid)) {
		socketIO.emitMessage('gas-join', dev.devid)
	}
})
devManager.on('device-lost', (devid) => {
	if (devManager.validLightSupport(devid)) {
		socketIO.emitMessage('lightbelt-lost', devid)
	}
	if (devManager.validCurtainSupport(devid)) {
		socketIO.emitMessage('curtains-lost', devid)
	}
	if (devManager.validPlugSupport(devid)) {
		socketIO.emitMessage('plug-lost', devid)
	}
	if (devManager.validSensorSupport(devid)) {
		socketIO.emitMessage('env-lost', devid)
	}
	if (devManager.validSensorCH4Support(devid)) {
		socketIO.emitMessage('gas-lost', devid)
	}
})
devManager.on('message', (params) => {
	const { devid, msg } = params
	console.log('message: ', devid, msg)
	
	if(devManager.validLightSupport(devid)){
		socketIO.emitMessage('lightbelt-rtv', {devid,data:msg.data})
		console.log("当前设备是灯带")
	}
	if(devManager.validCurtainSupport(devid)){
		socketIO.emitMessage('curtains-rtv', {devid,data:msg.data})
		console.log("当前设备是窗帘电机")
	}
	if(devManager.validPlugSupport(devid)){
		socketIO.emitMessage('Plug-rtv', {devid,data:msg.data})
		console.log("当前设备是智能插座")
	}
	if(devManager.validSensorSupport(devid)){
		socketIO.emitMessage('env-rtv', {devid,data:msg.data})
		console.log("当前设备是环境传感器")
	}
	if(devManager.validSensorCH4Support(devid)){
		socketIO.emitMessage('gas-rtv', {devid,data:msg.data})
		console.log("当前设备是燃气浓度传感器")
	}
	//socketIO.emitMessage('device-rtv', { devid, data: msg.data })
})

/*********************** HTTP start ************************/
const deviceRoute = require('./routes/device')
app.use('/api/device', deviceRoute)
/*********************** HTTP end **************************/

app.start()
require('iosched').forever()
