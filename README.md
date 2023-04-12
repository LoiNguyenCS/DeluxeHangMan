# DeluxeHangMan
The repository for the server to host the Hang Man game

So far we have these files to work with the users. ```app.ts``` should be the one that direcly connects to the user and takes their requests, and then invokes the corresponding methods from its ```HangManController``` instance. A ```HangManController``` instance is mainly for creating, modifying, or deleting its ```Game``` instances. Each ```Game``` instance is a single session. For now, we say that a session is created where the first ```Player``` joins and deleted when the last ```Player``` leaves. A ```Team``` instance is essentially a group of ```Player```.
```
src/app.ts
src/HangManController.ts
src/Player.ts
src/Team.ts
src/Game.ts
```
We also have this file to show the main page:

```dist/index.html```

To run this project, clone it locally to your machine, then perform ```npm install```. After that, do ```npm start```, a server will be hosted on ```http://localhost:2010/```
