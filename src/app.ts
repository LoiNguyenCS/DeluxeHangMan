/**
 * This is the place where we receive connection from Covey.Town and perform corresponding tasks
 */
import { HangManController } from "./HangManController";
import express from 'express';
import path from 'path';

const app = express();
const port = 2010;
app.use('/dist', express.static('dist'));
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
  });
app.listen(port, () => {
   return console.log(`Express is listening at http://localhost:${port}`);    
});
const thisController = new HangManController();

