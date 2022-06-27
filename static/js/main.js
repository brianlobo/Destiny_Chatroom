const chatForm = document.querySelector('#chat-form')
const chatMessages = document.querySelector('.chat-messages')
const roomName = document.querySelector('#room-name')
const userList = document.querySelector('#users')

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room })

// Get room and user info
socket.on("roomUsers", ({ room, users }) => {
    displayCurrentRoom(room);
    displayLiveUsers(users);
})

// When client recieves msg from server
socket.on('message', message => {
    displayMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', e => {
    e.preventDefault();

    // Grab chat text
    const message = e.target.elements.message.value;
    
    // Emit message back to server
    socket.emit('chatMessage', message);

    // Clear chat input
    e.target.elements.message.value = '';
    e.target.elements.message.focus();
});

const displayMessage = message => {
    const div = document.createElement('div');

    div.classList.add('message');
    // Check if user sent this msg to move left or right
    if (message.username === username) {
        div.classList.add('chat-sent');
    }

    div.innerHTML = `	
        <div class="flex"> <p class="meta mr-2">${message.username}</p>
                            <p class="meta"> ${message.time}</p> 
                            <p class="ml-auto meta">${message.date}</p> </div>
        <p class="text">
            ${message.text}
        </p>
        `;
    document.querySelector(".chat-messages").appendChild(div);
}

const displayCurrentRoom = room => {
    roomName.innerText = room;
};

const displayLiveUsers = users => {
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('\n')}`;
};