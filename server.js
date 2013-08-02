var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    messages = [],
    sockets = [];

app.use( express.static(__dirname + '/public'));

server.listen(4000);

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

    sockets.push(socket);

    socket.emit('messages-available', messages);

    socket.on('add-message', function (data) {
        var message = {
            name: data.name,
            message: data.message,
            time: new Date()
        };
        messages.push(message);
        sockets.forEach(function (socket) {
            socket.emit('message-added', message);
        });
    });
});