/**
 * Each Player instance corresponds to one player.
 */
import { Team } from "./Team";

export class Player {
    private name: string;
    private score: number;
    private team: Team | undefined;
    constructor(playerName: string, teamToJoin: Team | undefined) {
        this.name = playerName;
        this.team = teamToJoin;
    }
}