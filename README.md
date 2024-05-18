# websocket 心跳机制

## 1. 初始化

```javascript
/**
 * 创建一个新的 Socket 实例。
 *
 * @param {string} url - WebSocket 服务器 URL。
 * @param {number} ht - 心跳间隔时间，单位是毫秒。
 * @param {number} rt - 重连间隔时间，单位是毫秒。
 */
const socket = new Socket(url, ht, rt);
```

## 2. 事件

```javascript
// 连接成功
socket.onopen = (event) => {};
// 失去连接
socket.onclose = (event) => {};
// 连接失败
socket.onerror = (event) => {};
// 接收消息
socket.onmessage = (event) => {};
// 重连
socket.onreconnect = (event) => {};
```
