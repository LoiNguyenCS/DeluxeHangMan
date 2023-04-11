/**
 * This is the place where we control the whole HangMan server in general
 */
import express from 'express';
import { Team } from './Team';
import { Player } from './Player';
import path from 'path';

export class HangManController {
  private port: number;
  private listOfPlayers: Player[];
  private listOfTeams: Team[];
  private serverStarted = false;
  constructor() {
    this.port = 2010;
  }
  startServer() {
    if (this.serverStarted === true) {
        throw new Error('Server is started already!');
    }
    const app = express();
    const port = this.port;
    app.use('/dist', express.static('dist'));
    app.get('/', (_, res) => {
        res.sendFile(path.join(__dirname, './index.html'));
      });
    app.listen(port, () => {
       return console.log(`Express is listening at http://localhost:${port}`);    
    });
  }
  addPlayer(newPlayer: Player) {
    this.listOfPlayers.push(newPlayer);
  }
  addTeam(newTeam: Team) {
    this.listOfTeams.push(newTeam);
  }
  removePlayer() {
    throw new Error("Function not implemented");
  }
  removeTeam() {
    throw new Error("Function not implemented");
  }
}

