class GameSession {
    constructor(roomId, io) {
      this.roomId = roomId;
      this.word = 'apple'; // The word to be guessed
      this.guesses = new Set(); // Set to store the guessed letters
      this.io = io;
    }
  
    handleGuess(guess) {
      if (this.word.includes(guess) && !this.guesses.has(guess)) {
        this.guesses.add(guess);
        console.log(`Correct guess: ${guess}`);
        this.io.to(this.roomId).emit('game-state', {
          correctGuess: guess,
          guesses: Array.from(this.guesses)
        });
      } else {
        console.log(`Incorrect guess: ${guess}`);
        this.io.to(this.roomId).emit('game-state', {
          incorrectGuess: guess,
          guesses: Array.from(this.guesses)
        });
      }
    }
  }
  
  module.exports = GameSession;
  