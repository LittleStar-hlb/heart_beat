class Socket {
  #socketStatus;
  #heartbeatTimer;
  #isReconnect;
  #socket;
  #url;
  #heartBeatSendData;
  #ht;
  #rt;

  static #receiveInit(url, ht, rt) {
    if (!url) {
      throw new Error('url is required');
    } else if (typeof url !== 'string') {
      throw new Error('url must be a string');
    } else if (typeof ht !== 'number') {
      throw new Error('ht must be a number');
    } else if (typeof rt !== 'number') {
      throw new Error('rt must be a number');
    } else if (ht <= 0) {
      throw new Error('ht must be greater than 0');
    } else if (rt <= 0) {
      throw new Error('rt must be greater than 0');
    } else {
      return true;
    }
  }

  constructor(url, ht = 4000, rt = 3000) {
    Socket.#receiveInit(url, ht, rt);
    this.#socketStatus = false;
    this.#heartbeatTimer = null;
    this.#isReconnect = true;
    this.#socket = null;
    this.#url = url;
    this.#ht = ht;
    this.#rt = rt;
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

  send(data) {
    if (this.#socketStatus) {
      this.#socket.send(data);
    } else {
      throw new Error('Socket is not connected');
    }
  }

  close() {
    if (this.#socketStatus) {
      this.#socket.close();
      this.#isReconnect = false;
    } else {
      throw new Error('Socket is not connected');
    }
  }

  #createSocket() {
    this.#socket = new WebSocket(this.#url);
  }

  #initEvent() {
    this.#socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        switch (data.type) {
          case 'heart_beat':
            this.onreconnect(event);
            break;
          default:
            this.onmessage(event);
            break;
        }
      } catch (error) {
        this.onmessage(event);
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

      if (this.#isReconnect || !event.wasClean) {
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
    }, this.#ht);
  }

  #reconnect() {
    this.#destroy();

    setTimeout(() => {
      this.#createSocket();
      this.#initEvent();
    }, this.#rt);
  }

  #destroy() {
    clearInterval(this.#heartbeatTimer);
    this.#heartbeatTimer = null;
  }
}
