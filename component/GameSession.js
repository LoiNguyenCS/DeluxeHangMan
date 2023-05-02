const Queue = require('./Queue')
class GameSession {
  
  constructor() {
    this.States = {
      TRUE_WAIT: 'True_Wait', // in this state, no player is in game and thus the timer should not be going down at all
      WAIT: 'Wait', // Have atleast one player in, countdown to start game starts
      IN_PROGRESS: 'In Progress', // game is in progress and each countdown will switch the current active player
      WIN: 'Win',// game has been won
      LOSE: 'Lose'/// game has been lost
    };
    
    this.header = "Waiting for Players" // what dispalys as the header for the players
    this.hangImage = "hang0.png"; // the current hangman image displayed
    this.listOfPlayers = new Queue();
    this.idToName = {};// correlates socket id to name so that disconnetd players can be removed
    this.fullWord = '';// The full unhidden word
    this.word = '';// the word currently displayed on screen, complete with all its hidden portions
    this.ActivePlayer = 0;// The player whose turn it is, set to 0 when noone is assigned yet
    this.guessedLetters = []; // letters previously guessed, used to catch up people who join mid-game
    this.PlayerPassTimer = 30; // Time it takes for the active player to switch out while game is in progress and the current actiove player has not clicked a key
    this.WaitingTimer = 60; // Time it takes for pre-game wait period, allowing players a chance to join before game starts
    this.RestartTimer = 20; // once game ends, how long it takes for the game to restart
    this.status = this.States.TRUE_WAIT; // status of the current game session
    this.Seconds = this.WaitingTimer + 1; // The seconds that should display on the timer
    this.hang = 0;// the state of the hangman image, the number corresponds to how many incorrect guesses, need 7 incorrect guesses to lose
    this.PossibleWords = [
      "shabby",
      "zippy",
      "blue in the face",
      "ignorance is bliss",
      "knee jerk reaction",
      "my Achilles heel",
      "cog in the machine",
      "hold your horses",
      "burning the midnight oil",
      "the worlds my oyster",
      "dont muddy the waters",
      "upset the apple cart",
      "hot cherry pie slice",
      "a cast iron stomach",
      "batten down hatches",
      "point of view",
      "shiver me timbers"
      ]; // all possible words for hangman to choose from
  }

//add player to the game, sets status to WAIT if this is the first player joining
  addPlayer(player,id) {
this.idToName[id] = player;
    this.listOfPlayers.enqueue(player)
    if(this.status == this.States.TRUE_WAIT){
      this.status = this.States.WAIT;
      this.SetTimer(this.WaitingTimer);
    }

  }
//sets timer to given time, +1 is to account for delay
  SetTimer(time){
    this.Seconds = time +1;
  }

//picks a random word at the start of the game
PickWord(){
        
        let randomNumber = Math.floor(Math.random() * this.PossibleWords.length);
        this.fullWord = this.PossibleWords[randomNumber];
        this.word = this.HideWord(this.fullWord);

        
      }
//Hides the whole word given, replacing characters with '_'
HideWord(word){
  let hiddenWord = ""
  for(let i = 0;i<word.length;i++){
    if(word.charAt(i) == ' '){
      hiddenWord += ' ';
    }else{
      hiddenWord += '_';
    }
  }
  return hiddenWord;
}
//adds 1 to hang to signify an incorrect guess, updates hangmanimage as well
UpdateHang(){
  this.hang++
  if(this.hang < 7){
  this.hangImage = "hang"+this.hang+".png"
  }else{
    this.setGameOver("Lose");
  }
}
  
//reveals all instances of the given key of the word
UpdateWord(key){
  this.guessedLetters.push(key);
  let atleastOne = false;
  let newWord = "";
  for(let i = 0;i<this.fullWord.length;i++){
    if(this.fullWord.charAt(i).toUpperCase() == key){
      newWord += key;
      atleastOne = true;
    }else{
      newWord += this.word.charAt(i);
    }
  }
  if(atleastOne){
    this.word = newWord;
    this.checkIfWin();
    return true
    

  }else{
    this.UpdateHang();
    return false
    //CheckIfLose()
  }

}
//changes players to the next in queue, sets the current active player to last in queue
SwitchPlayer(){
  this.ActivePlayer = this.listOfPlayers.dequeue();
  this.listOfPlayers.enqueue(this.ActivePlayer);
  this.UpdateHeader(this.ActivePlayer+"'s Turn");
  this.SetTimer(this.PlayerPassTimer);
}
//changes the headers displayed message
UpdateHeader(message){
  this.header = message;
}
//sets game to either win or lose state and updates header accordingly, starts restrat timer as well
setGameOver(state){
  this.status = state;
  if(state == "Win"){
    this.UpdateHeader("YOU WON CONGRATS!!!...new game starting shortly")
  }else{
    this.UpdateHeader("Sorry you lost...new game starting shortly")
  }
  this.SetTimer(this.RestartTimer);
}
//resets the entire game
RestartGame(){
  this.guessedLetters = [];
  this.word = '';
  this.fullWord = '';
  this.ActivePlayer = 0;
  this.hang = 0;
  this.header = "Waiting for Players"
  this.hangImage = "hang0.png";
  this.status = this.States.WAIT;
  this.SetTimer(this.WaitingTimer);

}
//checks to see if the word is fully revealed
checkIfWin(){
  for(let i = 0;i<this.word.length;i++){
    if(this.word.charAt(i) == '_'){
      return;
    }
  }
  this.setGameOver("Win");
}
//removes a player from the queue if they disconnect
RemovePlayer(id){
  let name = this.idToName[id];
  
  delete this.idToName[id];
  
  if(this.ActivePlayer == name){
    this.SwitchPlayer();
  }
  this.listOfPlayers.forceOut(name);
  
  
}
//checks if the given user name is unique or already exists in the queue, if it does returns number of occureces so that the name can be updated
CheckNameUnique(name){
  let num = 0
  num += this.listOfPlayers.CountOccurrence(name);
  return num;
}
  
}
module.exports = GameSession
