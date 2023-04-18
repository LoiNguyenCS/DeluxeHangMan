class Player {
    name;
    constructor(name) {
      this.name = name;
      this.score = 0;
    }
  
    increaseScore() {
      this.score++;
    }

    getName() {
        return this.name;
    }
  
    resetScore() {
      this.score = 0;
    }
  }
module.exports = Player;