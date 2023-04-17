class Player {
    playerID;
    constructor(playerId) {
        this.playerID = playerId;
    }
    updateID(playerId) {
        this.playerID = playerId;
    }
}
module.exports = Player;