const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8000 });

// 监听连接事件
server.on('connection', (ws, req) => {
  ws.on('message', (dataStr) => {
    try {
      const data = JSON.parse(dataStr);
      switch (data.type) {
        case 'heart_beat':
          ws.send(JSON.stringify(data));
          break;
        default:
          ws.send(JSON.stringify(data));
          break;
      }
    } catch (error) {
      const data = dataStr.toString();
      switch (data) {
        case 'close':
          ws.close();
          break;
        default:
          ws.send(dataStr);
          break;
      }
    }
  });

  ws.on('close', () => {
    console.log('---server close');

    ws.send(JSON.stringify({
      type: 'close',
      data: 'server close'
    }));
  });

  ws.on('error', (err) => {
    console.log('---server error', err);
  });
})



