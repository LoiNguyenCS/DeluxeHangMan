const GameSession = require('./component/GameSession')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const sessionProgress = {}
const sessionList = {}
let currentSession = new GameSession('', 0)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/welcome.html')
})

io.sockets.on('connection', function (socket) {
  console.log(`a user connected with id ${socket.id}`)
  socket.on('joinAsIndividual', () => {
    const roomId = `${socket.id}`
    console.log(`server created /${roomId}`)
    // Create a unique URL for the player
    app.get(`/${roomId}`, (req, res) => {
      res.sendFile(__dirname + '/public/index.html')
    })
    currentSession = new GameSession('HELLO', 5)
    currentSession.addPlayer(roomId)
    sessionList[roomId] = currentSession
  })
  socket.on('joinAsTeam', (teamID) => {
    const roomId = teamID
    console.log(`user joined team /${roomId}`)
    if (sessionList[teamID]) {
      currentSession = sessionList[teamID]
      if (currentSession.progress().size == 0) {
        socket.emit('gotATeam')
        currentSession.addPlayer(`${socket.id}`)
      } else {
        socket.emit('teamAlreadyStarted')
      }
    } else {
      socket.emit('invalidTeamID')
    }
  })
  socket.on('keyPressed', (letter, teamID) => {
    const letterGuessed = `${letter}`
    console.log(`User ${socket.id} chose ${letter}`)
    currentSession = sessionList[teamID]
    currentSession.guess(letterGuessed)
    const attemptsLeft = currentSession.attemptsLeft
    io.sockets.emit('keyPressed', letter, teamID)
    console.log(`${attemptsLeft} attemps left`)
    if (currentSession.status == 'WIN' || currentSession.status == 'LOSE') {
      io.sockets.emit('endGame', currentSession.status, teamID)
    }
  })
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
