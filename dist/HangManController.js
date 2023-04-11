"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HangManController = void 0;
/**
 * This is the place where we control the whole HangMan server in general
 */
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
class HangManController {
    constructor() {
        this.serverStarted = false;
        this.port = 2010;
    }
    startServer() {
        if (this.serverStarted === true) {
            throw new Error('Server is started already!');
        }
        const app = (0, express_1.default)();
        const port = this.port;
        app.use('/dist', express_1.default.static('dist'));
        app.get('/', (_, res) => {
            res.sendFile(path_1.default.join(__dirname, './index.html'));
        });
        app.listen(port, () => {
            return console.log(`Express is listening at http://localhost:${port}`);
        });
    }
    addPlayer(newPlayer) {
        this.listOfPlayers.push(newPlayer);
    }
    addTeam(newTeam) {
        this.listOfTeams.push(newTeam);
    }
    removePlayer() {
        throw new Error("Function not implemented");
    }
    removeTeam() {
        throw new Error("Function not implemented");
    }
}
exports.HangManController = HangManController;
//# sourceMappingURL=HangManController.js.map