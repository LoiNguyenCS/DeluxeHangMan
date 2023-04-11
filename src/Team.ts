/**
 * This is the class for teams in this server. My idea is that we create one Team object for each time
 */

import { Player } from "./Player";

export class Team {
    private players: Player[];
    private score: number;
    private host: Player;
}