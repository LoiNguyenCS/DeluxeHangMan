const GameSession = require('./component/GameSession');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

io.sockets.on('connection', function (socket) {
  console.log(`a user connected with id ${socket.id}`);
  const roomId = `room-${socket.id}`;
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

    
server.listen(3000, () => {
  console.log('listening on *:3000');
});
