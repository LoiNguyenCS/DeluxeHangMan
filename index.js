const GameSession = require('./component/GameSession')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
/* this is a map, with each key as a socket id and each value as a GameSession instance. The socket id is the id of 
the user who created that GameSession instance 
*/
const sessionList = {}
let currentSession = new GameSession('', 0)

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/welcome.html')
})

/**
 * If a player joins as an individual, a new webpage will be served at localhost:3000/socket_id. Otherwise, he will join
 * another webpage created by some previous users. For convenience, we don't discriminate between individual mode and 
 * team mode at the backend level. Every game session is regarded as a GameSession instance equally. Right now we are
 * having a lot of console logs printed because it is convenient for debugging. We can delete them in the future.
 */
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
  /*
   When a user clicks a button, the client side will send a keyPressed message to the server side. 
   Then the server side will send another keyPressed message to other users. 
   Then all the related users will have their webpage updated based on the message from the server side.
   For example, if user 1 of team A clicks letter "E", the letter "E" will disappear on the webpage of user 1, 
   and user 1 will send a message to the server. The server will then send a message to all the users, specifying that
   letter "E" has been pressed for team A. Then other members in team A will receive the message and have their webpages updated
   */
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
