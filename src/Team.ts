/**
 * Each Team instance correspond to one team.
 */

import { Player } from "./Player";

export class Team {
    private players: Player[];
    private score: number;
    // the one who will decide the words for other player to guess
    private host: Player;
}