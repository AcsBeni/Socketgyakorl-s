const socket = io();
const msgInput = document.getElementById('msgInput');
const sendBtn = document.getElementById('sendBtn');
const messagesBox = document.getElementById('messages');

sendBtn.onclick=()=>{
    if(msgInput.value != ''){
        socket.emit('newMessage',msgInput.value)
        msgInput.value = ''
    }

}
socket.on('newMessage', (msg)=>{
    const div = document.createElement('div')
    div.innerText = msg;
    messagesBox.appendChild(div)
    messagesBox.scrollTop = messagesBox.scrollHeight;

})