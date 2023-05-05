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
let timerId = undefined;
let mock =  new GameSession()



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
    let session = new GameSession()
    
    sessionList[roomId] = session
    
    if(timerId){
      clearTimeout(timerId);
      console.log("time Cleared");
    }
    
    timerId = setTimeout(timerFunctionStartup, 1000)
    
    
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
    currentSessions(socket).addPlayer(name, socket.id,socket)
    UpdateOneWord(socket)
    UpdateOneHang(socket)
    UpdateOneHeader(socket)
    UpdateKeyboard(socket)
  })
  //counts down the timer for everyone, conforming to certain events depending on game state when counter reaches zero
  function timerFunctionStartup(){
    for( let key in sessionList){
      timerFunction(sessionList[key])
    }
    timerId = setTimeout(timerFunctionStartup, 1000)

  }
  function timerFunction(game) {
    let socket = game.sockets[0];
    if (game.Seconds != 0 && game.status != 'True_Wait') {
      game.Seconds -= 1
      UpdateTimer(socket)
    } else {
      switch (game.status) {
        case 'Wait':
          game.status = 'In Progress'
          game.PickWord()
          UpdateWord(socket)
        case 'In Progress':
          game.SwitchPlayer()
          UpdateHeader(socket)
          break
        case 'Win':
        case 'Lose':
          game.RestartGame()
          ResetPlayers(socket)
      }
    }
    
    
    
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
    console.log("first " + socket.request.headers.referer)
    if (
      currentSessions(socket).ActivePlayer == name &&
      currentSessions(socket).status == 'In Progress'
    ) {
      currentSessions(socket).SwitchPlayer()
      UpdateHeader(socket)
      HideKey(letter,socket)
      if (currentSessions(socket).UpdateWord(letter)) {
        UpdateWord(socket)
      } else {
        UpdateHang(socket)
      }
      checkIfGameOver(socket)
    }
  })

  //Remove the player when player disconnects
  socket.on('disconnect', () => {
    if(currentSessions(socket) != undefined){
    currentSessions(socket).RemovePlayer(socket.id)
    UpdateHeader(socket)
  }
    
    
  })
})

//where server listens
server.listen(3000, () => {
  console.log('listening on *:3000')
})

//Checks to see if the game has either been won or lost
function checkIfGameOver(socket) {
  var state = currentSessions(socket).status
  if (state == 'Win' || state == 'Lose') {
    UpdateHeader(socket)
  } else {
    return
  }
}

//Hides given key for all players
function HideKey(letter,socket) {
  sendToGame('HideKey',letter,socket)
}
//updates header for all players
function UpdateHeader(socket) {
  sendToGame('UpdateHeader',currentSessions(socket).header,socket)
  

}
// updates how the current word is displayed for all players
function UpdateWord(socket) {
  sendToGame('UpdateWord',currentSessions(socket).word,socket)
}
//Updates Timer for all players
function UpdateTimer(socket) {
 
  sendToGame('UpdateTimer',currentSessions(socket).Seconds,socket)
}
//Updates hangman image for all players
function UpdateHang(socket) {
  let image = fs.readFileSync(currentSessions(socket).hangImage)
  sendToGame('UpdateHang',image,socket)
}
//causes all players to reset their keyboard keys
function ResetKeyboard(socket) {
  
  sendToGame('ResetKeyboard','',socket)
}
//Removes the word for all players
function RemoveWord(socket) {
  
  sendToGame('RemoveWord','',socket)
}
//Updates the keyboard of the user who just joined
function UpdateKeyboard(socket) {
  socket.emit('UpdateKeyboard', currentSessions(socket).guessedLetters)
}

//ALL BELOW function as their none "One" counterparts, only difference is that these act on the player who just joined the game and needs to be updated
function UpdateOneHeader(socket) {
  socket.emit('UpdateHeader', currentSessions(socket).header)
}
function UpdateOneWord(socket) {
  socket.emit('UpdateWord', currentSessions(socket).word)
}
function UpdateOneTimer(socket) {
  socket.emit('UpdateTimer', currentSessions(socket).Seconds)
}
function UpdateOneHang(socket) {
  let image = fs.readFileSync(currentSessions(socket).hangImage)
  socket.emit('UpdateHang', image)
}

//Checks if the given username is unique, if not then modifies it and sends it back so it is unique
function CheckNameUnique(name, socket) {
  let num = currentSessions(socket).CheckNameUnique(name)
  if (num) {
    name = name + '(' + num.toString() + ')'
    socket.emit('UpdateName', name)
   
  }
 
  return name
}

//Resets all players for a new game
function ResetPlayers(socket) {
  ResetKeyboard(socket)
  UpdateHeader(socket)
  UpdateWord(socket)
  UpdateHang(socket)
  RemoveWord(socket)
}
function currentSessions(socket){
  let ret = undefined
if(socket != undefined){


 let roomId = myGame(socket.request.headers.referer)

  ret = sessionList[roomId]
}
  
  if(ret != undefined){
    return ret
  }else{
    return mock
  }
}
function sendToGame(message,item,socket){
  
  currentSessions(socket).sockets.forEach(socket=> {
    socket.emit(message,item);
    });
}
function myGame(url){
  // get the current URL


// split the URL by "/"
var urlParts = url.split("/");

// get the last part of the URL
var lastPart = urlParts[urlParts.length - 1];

return lastPart; // print the last part to the console
}
