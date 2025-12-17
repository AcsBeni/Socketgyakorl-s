const socket = io();
const config = window.CHAT_CONFIG;

const leaveRoomBtn = document.getElementById('leaveRoom');
const messages = document.getElementById('messages');

const renderMessage = ({ nickname, message, timestamp, type }) => {
    const li = document.createElement('li');
    li.innerHTML = `
        <div class="${type}">
            <strong>${nickname}</strong>
            <span>${timestamp}</span>
            <p>${message}</p>
        </div>
    `;
    messages.appendChild(li);
};

leaveRoomBtn.addEventListener('click', () => {
    socket.emit('leave-room', {
        nickname: config.nickname,
        roomId: config.roomId
    });
    window.location.href = `/?nickname=${config.nickname}`;
});
socket.emit('join-room', {
    nickname: config.nickname,
    roomId: config.roomId
});

socket.on('system-message', (text) => {
    renderMessage({
        nickname: 'SYSTEM',
        message: text,
        timestamp: new Date().toLocaleTimeString(),
        type: 'system'
    });
});
