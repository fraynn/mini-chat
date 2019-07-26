const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

http.listen(3456, function() {
    console.log('Serveur started on : 3456')
})

let users = new Map();
let messagesList = [];

io.on('connection', (socket) => {
    // Convert the Map to an array for JSON-encoded data over the wire
    let usersArray = Array.from(users);
    socket.emit('firstConnection', messagesList, usersArray);
    socket.on('login', user => {
        users.set(socket.id, user);
        console.log(users);
        io.emit('login', user);
    });
    socket.on('message', user => {
        messagesList.push([socket.id, user.message])
        io.emit('message', user);
    });
    socket.on('changedColor', user => {
        users.set(socket.id, user);
        io.emit('updateColor', user);
    });
    socket.on('disconnect', () => {
        socket.broadcast.emit('disconnected', users.get(socket.id));
    })
})

