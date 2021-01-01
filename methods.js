const crypto = require('crypto');
var userlist = [];
var gamelist = [];
const heads = require('./heads.js');
const fs = require('fs');


module.exports.postRequest = function(req, res, query){  
  switch(req.url){
    case('/ranking'):
    ranking(res);
    break;

    case("/register"):
    register(res, query.nick, query.pass);
    break;

    case("/join"):
    join(res, query.nick, query.group);
    break;

    case("/leave"):
    leave(res, query.nick);
    break;

    case("/notify"):
    notify(res, query.nick, query.game, query.move);
    break;
  }
}

function register(response, nick, pass){
  const hash = crypto
               .createHash('md5')
               .update(pass)
               .digest('hex');

  fs.readFile('users.json', 'utf8', (err,data) => {

    userlist = JSON.parse(data);

    if(err){
      response.writeHead(400,heads.heade.txt);
      response.write('{ "error": "Bad Request" }');
      response.end();
      return;
    }else{
      for(var i = 0; i < userlist.length; i++){
        if(userlist[i].nick == nick && userlist[i].pass == hash){
          response.writeHead(200,heads.heade.txt);
          response.write('{}');
          response.end();
          return;
        }
        if(userlist[i].nick == nick && userlist[i].pass != hash){
          response.writeHead(401, heads.heade.txt);
          response.write('{ "error": "Wrong password" }');
          response.end();
          return;
        }
      } 
      addUser(nick, hash, response, data);
    }
  })
  console.log("nickname: "+nick+"  password: "+pass+"  hashed password: "+hash);
}

function addUser(nick, hash, response, data){

  const user = {"nick": nick,
                "pass": hash,
                "victories": 0,
                "games": 0,
                "group": undefined,
                "color": undefined,
                "game": undefined
              };    
  userlist.push(user);
  fs.writeFile('./users.json', JSON.stringify(userlist),(err) => {if(err) console.error(err);})

  response.writeHead(200,heads.heade.txt);
  response.write('{}');
  response.end();
}

function ranking(response){
  fs.readFile('users.json', (err,data) =>{
    if(!err) userlist = JSON.parse(data);
  })
  
  userlist.sort((a,b) => b.victories - a.victories)
  var topTen = [];
  
  for(let i = 0; i < 10 && i < userlist.length; i++){
    const info = {"nick": userlist[i].nick,
                  "victories":  userlist[i].victories,
                  "games": userlist[i].games
    };
    topTen.push(info);
    //console.log(info);
  } 
  
  response.writeHead(200,heads.heade.txt);
  response.write(JSON.stringify(topTen));
  response.end();
}

function join(response, nick, group){

  const hash = crypto
               .createHash('md5')
               .update(group)
               .digest('hex');

  fs.readFile('users.json', (err,data) => {
    if(!err) userlist = JSON.parse(data);
  })
  
  var playerCount = 0;
  var curUser;

  for(var tempUser of userlist){
    if(tempUser.game == hash) playerCount++;
  }

  for(var tempUser of userlist){
    if(tempUser.nick == nick) curUser = tempUser;  
  }

  switch(playerCount){

    case 0:
      curUser.color = "dark";
      curUser.group = group;
      curUser.game = hash;
      fs.writeFile('./users.json', JSON.stringify(userlist),(err) => {if(err) console.error(err);})
      console.log("color = "+curUser.color+"  group: "+curUser.group+"  hash: "+curUser.game);
      
      fs.readFile('boards.json', (err,data) => {
        if(!err) gamelist = JSON.parse(data);
      })
      const game = {"gameCode": hash,
                    "board": initialGame
                   };
      gamelist.push(game);
      fs.writeFile('./boards.json', JSON.stringify(gamelist),(err) => {if(err) console.error(err);})

      response.writeHead(200,heads.heade.txt);
      response.write('{}');
      response.end();
    break;

    case 1:
      curUser.color = "light";
      curUser.group = group;
      curUser.game = hash;
      fs.writeFile('./users.json', JSON.stringify(userlist),(err) => {if(err) console.error(err);})
      console.log("color = "+curUser.color+"  group: "+curUser.group+"  hash: "+curUser.game);
      response.writeHead(200,heads.heade.txt);
      response.write('{}');
      response.end();
    break;

    case 2:
    console.log("Tried to enter a full game");
    response.writeHead(400,heads.heade.txt);
    response.write('{ "error": "Bad Request" }');
    response.end();
    break;

  }
}

function leave(response, nick){
  fs.readFile('users.json', (err,data) => {
    if(!err) userlist = JSON.parse(data);
  })
  
  var curUser;
  for(var tempUser of userlist){
    if(tempUser.nick == nick)
      curUser = tempUser; 
  }
  for(var tempUser of userlist){
    if(tempUser.nick != nick && tempUser.game == curUser.game)
      tempUser.victories++; 
  }
    
  curUser.games++;
  curUser.color = undefined;
  curUser.group = undefined;
  curUser.game = undefined;

  fs.writeFile('./users.json', JSON.stringify(userlist),(err) => {if(err) console.error(err);})
  response.writeHead(200,heads.heade.txt);
  response.write('{}');
  response.end();

} 

function notify(response, nick, game, move){
  fs.readFile('users.json', (err,data) =>{
    if(!err) userlist = JSON.parse(data);
  })
  fs.writeFile('./users.json', JSON.stringify(userlist),(err) => {if(err) console.error(err);})

  fs.readFile('boards.json', (err,data) => {
    if(!err) gamelist = JSON.parse(data);
  })
  
  const x = move.row;
  const y = move.column;
  var moveColor;

  for(var tempUser of userlist){
    if(tempUser.nick == nick) moveColor = tempUser.color;
  }
  
  for(var tempGame of gamelist){
    console.log(tempGame.gameCode);
    console.log(game);
    if(tempGame.gameCode == game){
      console.log("Writing to position x: "+x+"  y: "+y);
      tempGame.board[x][y] = moveColor;
      fs.writeFile('./boards.json', JSON.stringify(gamelist),(err) => {if(err) console.error(err);})
    }
  }
  
  response.writeHead(200,heads.heade.txt);
  response.write('{}');
  response.end();
}

var initialGame =  [
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "light", "dark", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "dark", "light", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"],
  ["empty", "empty", "empty", "empty", "empty", "empty", "empty", "empty"]
]; 