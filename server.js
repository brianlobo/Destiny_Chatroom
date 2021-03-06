const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const express = require('express');
const formatMessage = require('./static/js/messages')
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./static/js/users')

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

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));