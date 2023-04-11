/**
 * This is to save the related information for each player
 */
import { Team } from "./Team";

export class Player {
    private name: string;
    private score: number;
    private team: Team | undefined;
}