const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const express = require('express');
const formatMessage = require('./utilities/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utilities/users')


const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botName = "Shaxx"

app.use(express.static(path.join(__dirname, 'static')));

// Runs when cliet connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);

        // Welcome User
        socket.emit("message", formatMessage(botName, `Welcome to the chat, guardian!`))

        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${username} has joined the chat`));  
        
        // send user and room info for page update
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    });

    // Listen for any chat messages
    socket.on("chatMessage", (message) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',  formatMessage(user.username, message));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message',  formatMessage(botName, `${user.username} has left the chat`));
           
            // send user and room info for page update
            io.to(user.room).emit('roomUsers', {
                room: user.room,
                users: getRoomUsers(user.room)
            })
        }
    });
})

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));