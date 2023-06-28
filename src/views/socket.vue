<template>
    <div class="test">
  
    </div>
  </template>
  
  <script>
    export default {
      name : 'socket',
      data() {
    return {
      path: 'ws://183.56.204.212:2718/ws/123456',
      // path: 'ws://192.168.0.139:9999/api/notification/topic/server',
      websocket: undefined
    }
  },
mounted() {
    // 初始化
    this.init()
  },
  destroyed() {
    // 销毁监听
    this.websocket.close()
  },
  methods: {
    init() {
      try {
        if (typeof WebSocket === 'undefined') {
          this.$notify({
            title: '警告',
            message: '您的浏览器不支持websocket！',
            type: 'warning'
          })
        } else {
          // 实例化websocket
          this.websocket = new WebSocket(this.path)
          // 监听websocket连接
          this.websocket.onopen = this.onopen
          // 监听websocket错误信息
          this.websocket.onerror = this.onerror
          // 监听websocket消息
          this.websocket.onmessage = this.onMessage
          // 监听websocket关闭
          this.websocket.onclose = this.onclose
          this.websocketSend()
        }
      } catch (error) {
        console.log(error)
      }
    },
    onopen() {
      console.log('websocket连接成功')
    },
    onerror() {
      console.log('连接错误')
      this.reconnect()
    },
    onMessage(e) {
      console.log(e,'e')
    },
    onclose() {
      console.log('websocket已经关闭')
      this.reconnect()
    },
    websocketSend(text) {
      try {
        setInterval(() => {
          this.websocket.send(new Date())
        }, 3000)
      } catch (err) {
        console.log('send failed (' + err.code + ')')
      }
    },
    reconnect() {
      var that = this
      if (that.lockReconnect) return
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      setTimeout(() => {
        console.info('尝试重连...')
        that.init()
        that.lockReconnect = false
      }, 5000)
    }
  }
    }
  </script>
  <style lang='less'>
   
  </style>
  