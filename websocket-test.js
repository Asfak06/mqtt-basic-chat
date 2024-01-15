const WebSocket = require('ws');

const ws = new WebSocket('ws://172.22.19.242:9001');

ws.on('open', function open() {
  console.log('Connected');
  ws.close();
});

ws.on('error', function error(err) {
  console.error('Connection Error:', err);
});
