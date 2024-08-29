    //监听灯的实时值
    socketClient.on('lightbelt-rtv', (params) => {
        if (selectedDevice && selectedDevice.devid === params.devid) {
          light_rtv = { ...light_rtv, ...params.data }
          console.log('lightbelt-rtv: ', light_rtv)
          // 更新渲染
          if (params.data.state !== undefined) {
            updatePowerRender(params.data.state)
          }
          if (params.data.bright !== undefined) {
            updateBrightSliderRender(params.data.bright)
          }
          if (params.data.color !== undefined) {
            updateColorPickerRender(params.data.color)
          }
  
          
        }
        
      })
  
      //监听开关的实时值
      socketClient.on('Plug-rtv',(params) =>{
        if (selectedDevice && selectedDevice.devid === params.devid) {
          plug_rtv = { ...plug_rtv, ...params.data }
          console.log('Plug-rtv: ', plug_rtv)
          // 更新渲染
          if (params.data.state !== undefined) {
            updatePowerRender(params.data.state)
          }
        }
      })
  
      //监听窗帘的实时值
      socketClient.on('curtains-rtv',(params) =>{
        if (selectedDevice && selectedDevice.devid === params.devid) {
          curtain_rtv = { ...curtain_rtv, ...params.data }
          console.log('curtains-rtv: ', curtain_rtv)
          
        }
      })
  
      //监听环境传感器的实时值
      socketClient.on('env-rtv',(params) =>{
        if (selectedDevice && selectedDevice.devid === params.devid) {
          sensor_rtv = { ...sensor_rtv, ...params.data }
          console.log('env-rtv: ', sensor_rtv)
          // // 更新渲染
         
        }
      })
  
      //监听燃气传感器的实时值
      socketClient.on('gas-rtv',(params) =>{
        if (selectedDevice && selectedDevice.devid === params.devid) {
          sensorCh4_rtv = { ...sensorCh4_rtv, ...params.data }
          console.log('gas-rtv: ', sensorCh4_rtv)
          // 更新渲染
          if (sensorCh4_rtv.state === 'alarm') {
            // console.log("看看我执行了没有")
            console.log(deviceStore)
            control(deviceStore['light.belt'][0].devid, {
                    method: 'set',
                    data: {
                      state: 'on',
                      start: 0,
                      end: 255,
                      bright: 100,
                      color: [255, 0, 0]                    
                      }
                    }
            ).catch(console.warn)
          }
          else{
            control(deviceStore['light.belt'][0].devid, {
              method: 'set',
              data: {
                state: 'off'
              }
            })
          }
          
        }
        }
      )
