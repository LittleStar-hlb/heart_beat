const c_sendBtn = document.getElementById('c_sendBtn');
const c_closeBtn = document.getElementById('c_closeBtn');
const s_closeBtn = document.getElementById('s_closeBtn');

const WS_URL = 'ws://localhost:8000';
const socket = new Socket(WS_URL);

c_sendBtn.addEventListener('click', () => {
  socket.send('hello server');
});

c_closeBtn.addEventListener('click', () => {
  socket.close();
});

s_closeBtn.addEventListener('click', () => {
  socket.send('close');
});

socket.onopen = (event) => {

};
socket.onclose = (event) => {

};
socket.onerror = (event) => {

};
socket.onmessage = (event) => {
  console.log(event);
};
socket.onreconnect = (event) => {

}






