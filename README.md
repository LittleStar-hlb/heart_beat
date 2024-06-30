# webSocket 心跳机制

## 1. 开始

```javascript
/**
 * @constructor
 * @param {string} url - WebSocket 服务器 URL。
 * @param {number} ht - 心跳间隔时间，单位是毫秒。
 * @param {number} rt - 重连延迟时间，单位是毫秒。
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

## 3. 调用方法

```javascript
// 通过 socket 发送数据
socket.send();
// 关闭 socket 连接
socket.close();
```
