const WS_TYPE = Object.freeze({
  HEART_BEAT: 'heart_beat',
});

const heartBeatSendData = {
  type: WS_TYPE.HEART_BEAT,
  data: 'hello server!'
};

class Socket {
  send(data) {
    this.socket.send(data);
  };

  close() {
    this.socket.close();
  };

  constructor(url) {
    this.socketStatus = false;
    this.heartbeatTimer = null;
    this.socket = null;
    this.url = url;

    this.onopen = () => { };
    this.onclose = () => { };
    this.onerror = () => { };
    this.onmessage = () => { };
    this.onreconnect = () => { };

    this.createSocket();
    this.initEvent();
  }

  createSocket() {
    this.socket = new WebSocket(this.url);
  }

  initEvent() {
    this.socket.onmessage = (event) => {
      let data = JSON.parse(event.data);

      switch (data.type) {
        case WS_TYPE.HEART_BEAT:
          this.onreconnect(event);
          break;
        default:
          this.onmessage(event);
          break;
      }

      this.startHeartbeat();
    };

    this.socket.onopen = (event) => {
      this.onopen(event);
      this.socketStatus = true;
      this.startHeartbeat();
    };

    this.socket.onclose = (event) => {
      this.onclose(event);
      this.socketStatus = false;
      this.distory();
    };

    this.socket.onerror = (event) => {
      this.onerror(event);
      this.socketStatus = false;
      this.reconnect();
    };
  }

  startHeartbeat() {
    this.distory();

    this.heartbeatTimer = setInterval(() => {
      this.socket.send(JSON.stringify(heartBeatSendData));
    }, 4000);
  }

  reconnect() {
    this.distory();

    setTimeout(() => {
      this.createSocket();
      this.initEvent();
    }, 3000);
  }

  distory() {
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = null;
  }
}


