class Socket {
  #socketStatus;
  #heartbeatTimer;
  #isReconnect;
  #socket;
  #url;
  #heartBeatSendData;

  send(data) {
    if (this.#socketStatus) {
      this.#socket.send(data);
    } else {
      throw new Error('socket is not connected');
    }
  }

  close() {
    if (this.#socketStatus) {
      this.#socket.close();
      this.#isReconnect = false;
    } else {
      throw new Error('socket is not connected');
    }
  }

  constructor(url) {
    this.#socketStatus = false;
    this.#heartbeatTimer = null;
    this.#isReconnect = true;
    this.#socket = null;
    this.#url = url;
    this.#heartBeatSendData = Object.freeze({
      type: 'heart_beat',
      data: 'ping'
    });

    this.onopen = () => { };
    this.onclose = () => { };
    this.onerror = () => { };
    this.onmessage = () => { };
    this.onreconnect = () => { };

    this.#createSocket();
    this.#initEvent();
  }

  #createSocket() {
    this.#socket = new WebSocket(this.#url);
  }

  #initEvent() {
    this.#socket.onmessage = (event) => {
      let data = JSON.parse(event.data);

      switch (data.type) {
        case 'heart_beat':
          this.onreconnect(event);
          break;
        default:
          this.onmessage(event);
          break;
      }
    };

    this.#socket.onopen = (event) => {
      this.onopen(event);
      this.#socketStatus = true;
      this.#startHeartbeat();
    };

    this.#socket.onclose = (event) => {
      this.onclose(event);
      this.#socketStatus = false;

      if (this.#isReconnect) {
        this.#reconnect();
      } else {
        this.#destroy();
      }
    };

    this.#socket.onerror = (event) => {
      this.onerror(event);
      this.#socketStatus = false;
      this.#reconnect();
    };
  }

  #startHeartbeat() {
    this.#destroy();

    this.#heartbeatTimer = setInterval(() => {
      this.#socket.send(JSON.stringify(this.#heartBeatSendData));
    }, 4000);
  }

  #reconnect() {
    this.#destroy();

    setTimeout(() => {
      this.#createSocket();
      this.#initEvent();
    }, 3000);
  }

  #destroy() {
    clearInterval(this.#heartbeatTimer);
    this.#heartbeatTimer = null;
  }
}


