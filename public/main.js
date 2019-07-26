// IIFE (Immediately Invoked Function Expression) to avoid polluting the global namespace
(function () {
    let user = {
        pseudo: setPseudo(),
        color: setUserColor(),
        previousColor: null,
    }
    function setPseudo() {
        let pseudo
        do {
            pseudo = prompt('Choose a pseudo');
        } while (!pseudo);
        return pseudo;
    }

    let socket = io();
    let textForm = document.getElementById('textForm')
    let messageInput = document.querySelector('input[type="text"]');
    let colorForm = document.getElementById('colorForm');
    let currentColor = document.getElementById('currentColor');
    // displayMessages : id of the div containing all the messages sent

    socket.emit('login', user);

    textForm.addEventListener('submit', (event) => {
        event.preventDefault();
        user.message = messageInput.value;
        messageInput.value = '';
        socket.emit('message', user);
    });
    colorForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let color = setUserColor(generateRandomColor());
        user.previousColor = user.color;
        user.color = color;
        currentColor.style.backgroundColor = color;
        socket.emit('changedColor', user)
    })
    colorForm.addEventListener('input', (event) => {
        event.preventDefault();
        let color = setUserColor();
        user.previousColor = user.color;
        user.color = color;
        currentColor.style.backgroundColor = color;
        socket.emit('changedColor', user)
    })

    function setUserColor(color) {
        let colorInput = document.getElementById('colorPicker');
        let userColor = color ? color : colorInput.value;
        return userColor;
    }

    function generateRandomColor() {
        return '#' + Math.random().toString(16).substring(2, 8);
    }

    function renderMessage(user, message) {
        let p = document.createElement('p');
        p.innerHTML += `<span style="color:${user.color}">${user.pseudo}</span> ${message}`;
        return p;
    }

    socket.on('message', user => {
        let message = renderMessage(user, `: ${user.message}`);
        displayMessages.appendChild(message);
    });
    socket.on('login', user => {
        let notif = renderMessage(user, `vient de se connecter !`);
        displayMessages.appendChild(notif);
    });
    socket.on('disconnected', user => {
        let notif = renderMessage(user, `has left !`);
        displayMessages.appendChild(notif);
    });
    socket.on('firstConnection', (messagesList, usersArray) => {
        let newMap = new Map(usersArray);
        messagesList.forEach(message => {
            let user = newMap.get(message[0]);
            displayMessages.appendChild(renderMessage(user, message[1]));
        });
    });
    // TODO : broken selector : use data attribute with user ID
    socket.on('updateColor', user => {
        let userMessages = document.querySelectorAll(`span[style="color:${user.previousColor}"]`);
        console.log(user);
        userMessages.forEach( span => {
            span.style.color = user.color;
        });
    })
})();