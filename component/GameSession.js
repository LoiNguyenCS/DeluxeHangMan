class GameSession {
  constructor(word, maxAttempts) {
    this.word = word.toUpperCase();
    this.maxAttempts = maxAttempts;
    this.attemptsLeft = maxAttempts;
    this.guessedLetters = new Set();
    this.status = 'IN_PROGRESS';
  }

  guess(letter) {
    letter = letter.toUpperCase();
    if (this.guessedLetters.has(letter)) {
      return;
    }
    this.guessedLetters.add(letter);
    if (this.word.includes(letter)) {
      if (this.isWordGuessed()) {
        this.status = 'WIN';
      }
    } else {
      this.attemptsLeft--;
      if (this.attemptsLeft === 0) {
        this.status = 'LOSE';
      }
    }
  }

  isWordGuessed() {
    for (let letter of this.word) {
      if (!this.guessedLetters.has(letter)) {
        return false;
      }
    }
    return true;
  }

  getGuessedWord() {
    let result = '';
    for (let letter of this.word) {
      if (this.guessedLetters.has(letter)) {
        result += letter;
      } else {
        result += '_';
      }
    }
    return result;
  }
}
module.exports = GameSession;
  