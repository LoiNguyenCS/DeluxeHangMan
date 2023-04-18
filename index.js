const GameSession = require('./component/GameSession');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/welcome.html');
});

io.sockets.on('connection', function (socket) {
  console.log(`a user connected with id ${socket.id}`);
  const roomId = `${socket.id}`;
  console.log(`server created /${roomId}`);
  // Redirect the player to their unique URL
  app.get(`/${roomId}`, (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });
  const currentSession = new GameSession("HELLO", 5);
  socket.on('keyPressed', (letter) => {
    const letterGuessed = `${letter}`
    console.log(`User ${roomId} chose ${letter}`);
    currentSession.guess(letterGuessed);
    const attemptsLeft = currentSession.attemptsLeft;
    console.log(`${attemptsLeft} attemps left`);
    if (currentSession.status == 'WIN' || currentSession.status == 'LOSE') {
      socket.emit('endGame', currentSession.status);
    }
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
