const GameSession = require('./component/GameSession')
const fs = require('fs')
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
let currentSession = new GameSession()

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
  //Individual creates a game
  socket.on('joinAsIndividual', () => {
    const roomId = `${socket.id}`
    // Create a unique URL for the player
    app.get(`/${roomId}`, (req, res) => {
      res.sendFile(__dirname + '/public/index.html')
    })
    currentSession = new GameSession()

    sessionList[roomId] = currentSession
    setTimeout(timerFunction, 1000)
  })
  //determines if the game ID given exists or not, if it does then lets know that the game can be joined.
  socket.on('canJoin', (teamId) => {
    if (teamId in sessionList) {
      socket.emit('joinGame', teamId)
    } else {
      socket.emit('declineJoin')
    }
  })

  //New player added to game, initialize them and make sure they are prepared and updated
  socket.on('addPlayer', (name) => {
    name = CheckNameUnique(name, socket)
    currentSession.addPlayer(name, socket.id)
    UpdateOneWord(socket)
    UpdateOneHang(socket)
    UpdateOneHeader(socket)
    UpdateKeyboard(socket)
  })
  //counts down the timer for everyone, conforming to certain events depending on game state when counter reaches zero
  function timerFunction() {
    if (currentSession.Seconds != 0 && currentSession.status != 'True_Wait') {
      currentSession.Seconds -= 1
      UpdateTimer()
    } else {
      switch (currentSession.status) {
        case 'Wait':
          currentSession.status = 'In Progress'
          currentSession.PickWord()
          UpdateWord()
        case 'In Progress':
          currentSession.SwitchPlayer()
          UpdateHeader()
          break
        case 'Win':
        case 'Lose':
          currentSession.RestartGame()
          ResetPlayers()
      }
    }
    setTimeout(timerFunction, 1000)
  }

  /*
   When a user clicks a button, the client side will send a keyPressed message to the server side. 
   Then the server side will send another keyPressed message to other users. 
   Then all the related users will have their webpage updated based on the message from the server side.
   For example, if user 1 of team A clicks letter "E", the letter "E" will disappear on the webpage of user 1, 
   and user 1 will send a message to the server. The server will then send a message to all the users, specifying that
   letter "E" has been pressed for team A. Then other members in team A will receive the message and have their webpages updated
   */
  socket.on('KeyPressed', (letter, name) => {
    if (
      currentSession.ActivePlayer == name &&
      currentSession.status == 'In Progress'
    ) {
      currentSession.SwitchPlayer()
      UpdateHeader()
      HideKey(letter)
      if (currentSession.UpdateWord(letter)) {
        UpdateWord()
      } else {
        UpdateHang()
      }
      checkIfGameOver()
    }
  })

  //Remove the player when player disconnects
  socket.on('disconnect', () => {
    currentSession.RemovePlayer(socket.id)
    UpdateHeader()
  })
})

//where server listens
server.listen(3000, () => {
  console.log('listening on *:3000')
})

//Checks to see if the game has either been won or lost
function checkIfGameOver() {
  var state = currentSession.status
  if (state == 'Win' || state == 'Lose') {
    UpdateHeader()
  } else {
    return
  }
}

//Hides given key for all players
function HideKey(letter) {
  io.emit('HideKey', letter)
}
//updates header for all players
function UpdateHeader() {
  io.emit('UpdateHeader', currentSession.header)
}
// updates how the current word is displayed for all players
function UpdateWord() {
  io.emit('UpdateWord', currentSession.word)
}
//Updates Timer for all players
function UpdateTimer() {
  io.emit('UpdateTimer', currentSession.Seconds)
}
//Updates hangman image for all players
function UpdateHang() {
  let image = fs.readFileSync(currentSession.hangImage)
  io.emit('UpdateHang', image)
}
//causes all players to reset their keyboard keys
function ResetKeyboard() {
  io.emit('ResetKeyboard')
}
//Removes the word for all players
function RemoveWord() {
  io.emit('RemoveWord')
}
//Updates the keyboard of the user who just joined
function UpdateKeyboard(socket) {
  socket.emit('UpdateKeyboard', currentSession.guessedLetters)
}

//ALL BELOW function as their none "One" counterparts, only difference is that these act on the player who just joined the game and needs to be updated
function UpdateOneHeader(socket) {
  socket.emit('UpdateHeader', currentSession.header)
}
function UpdateOneWord(socket) {
  socket.emit('UpdateWord', currentSession.word)
}
function UpdateOneTimer(socket) {
  socket.emit('UpdateTimer', currentSession.Seconds)
}
function UpdateOneHang(socket) {
  let image = fs.readFileSync(currentSession.hangImage)
  socket.emit('UpdateHang', image)
}

//Checks if the given username is unique, if not then modifies it and sends it back so it is unique
function CheckNameUnique(name, socket) {
  let num = currentSession.CheckNameUnique(name)
  if (num) {
    name = name + '(' + num.toString() + ')'
    socket.emit('UpdateName', name)
    console.log('FIXED NAME' + name)
  }
  console.log('created ' + num.toString())
  return name
}

//Resets all players for a ew game
function ResetPlayers() {
  ResetKeyboard()
  UpdateHeader()
  UpdateWord()
  UpdateHang()
  RemoveWord()
}
