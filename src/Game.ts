/**
 * Each Game instance is a game session
 */

import { Player } from "./Player";
import { Team } from "./Team";

export class Game {
     participants: Player | Team;
     generateTheWord() {
        throw new Error("Not implemented");
     }
}