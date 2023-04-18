class Team {
    constructor(name, players) {
      this.name = name;
      this.players = players;
    }
  
    getScore() {
      let totalScore = 0;
      for (let player of this.players) {
        totalScore += player.score;
      }
      return totalScore;
    }
  
    resetScores() {
      for (let player of this.players) {
        player.resetScore();
      }
    }
  }
  module.exports = Team;