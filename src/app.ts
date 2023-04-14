/**
 * This is the place where we receive connection from Covey.Town and perform corresponding tasks
 */
import { HangManController } from "./HangManController";
import express from 'express';
import path from 'path';

const app = express();
const port = 2010;
app.use(express.static(__dirname + '/../public'));
app.get('/', function (req, res) {
  res.sendFile(__dirname + '../public/index.html');
});
app.listen(port, () => {
   return console.log(`Express is listening at http://localhost:${port}`);    
});
const thisController = new HangManController();

