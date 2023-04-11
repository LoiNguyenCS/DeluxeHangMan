/**
 * This is the place where we receive connection from Covey.Town and perform corresponding tasks
 */
import { HangManController } from "./HangManController";

const thisController = new HangManController();
thisController.startServer();
