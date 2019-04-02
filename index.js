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
    // TODO comment this part
    let usersString = JSON.stringify(Array.from(users));
    socket.emit('firstConnection', messagesList, usersString);
    socket.on('login', user => {
        users.set(socket.id, user);
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
    // socket.on('mousemoving', (mouseCoordinates) => socket.broadcast.emit('mousemoving', mouseCoordinates))
    // socket.on('mouseclick', (mouseCoordinates) => io.emit('mouseclick', mouseCoordinates))
})

