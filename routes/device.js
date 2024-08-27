const { devManager } = require('../libs/dev_manager')
const Router = require('webapp').Router

const router = new Router()

/* 查询设备列表 */
router.get('/list', (req, res) => {
    try {
        let list = devManager.getDeviceList()
        list = list.filter(item => devManager.validDeviceSupport(item.devid))
        res.send({ code: 1, msg: '查询数据成功', data: list })
    } catch (error) {
        res.send({ code: 0, msg: '查询失败' })
    }
})

/* 控制设备 */
router.post('/control', async (req, res) => {
    try {
        const { devid, data } = req.body
        await devManager.control(devid, data)
        res.send({ code: 1, msg: '控制成功' })
    } catch (error) {
        if (permission.isDenied(error)) {
            res.send({ code: 2, msg: '缺少设备控制权限' })
        } else {
            res.send({ code: 0, msg: '操作失败' })
        }
    }
})
module.exports = router
