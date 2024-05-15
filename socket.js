const sendBtn = document.getElementById('sendBtn');
const closeBtn = document.getElementById('closeBtn');

const WS_URL = 'ws://localhost:8000';
const socket = new Socket(WS_URL);

sendBtn.addEventListener('click', () => {
  socket.send(JSON.stringify({
    type: WS_TYPE.MESSAGE,
    data: 'hello server!'
  }));
});

closeBtn.addEventListener('click', () => {
  socket.close();
});

socket.onopen = (event) => {

};
socket.onclose = (event) => {

};
socket.onerror = (event) => {

};
socket.onmessage = (event) => {

};
socket.onreconnect = (event) => {

}






