const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', function (req, res) {
    res.send('Hello World');
});
app.get('/receiver', function (req, res) {
    // res.readFile('./receiver.html',{ root: __dirname });
    res.sendFile('./receiver.html',{ root: __dirname });
    // res.sendFile('./receiver.html');
    // console.log('reciver');
});
app.get('/sender', function (req, res) {
    res.sendFile('./sender.html',{ root: __dirname });
});

let users = [];

io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);

    socket.on('user_add', data => {
        users.push(data);
        io.emit('user_list', users);
    })

    socket.on('calling', data => {
        io.emit('calling', data);
    })

    socket.on('call_end', data => {
        io.emit('call_end', data);
    })

    socket.on('answer', data => {
        io.emit('answer', data);
    })
    socket.on('candidate', data => {
        io.emit('candidate', data);
    })

    socket.on('disconnect', async () => {
        console.log('user disconnected: ', socket.id);

        users = await users.filter(x => {
            return x.id != socket.id;
        });

        io.emit('user_list', users);
    });

    
    socket.on('message', data => {
        io.emit('message', data);
    })
});

server.listen(3000, function () {
    const host = server.address().address
    const port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})