const crypto = require('crypto');
var userlist = [];
const heads = require('./heads.js');
const fs = require('fs');


module.exports.postRequest = function(req, res, query){  
  switch(req.url){
    case('/ranking'): //nada ainda
                      break;

    case("/register"):register(res, query.nick, query.pass);
                      break;
  }
}

function register(response, nick, pass){
  const hash = crypto
               .createHash('md5')
               .update(pass)
               .digest('hex');

  fs.readFile('users.json', 'utf8', (err,data) => {
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
      addUser(nick, hash, response);
    }
  })
  console.log("nickname: "+nick+"  password: "+pass+"  hashed password: "+hash);
}

function addUser(nick, hash,response){
  const user = {"nick": nick,
                "pass": hash,
                "victories" : 0,
                "games":0
              };    
  userlist.push(user);
  fs.writeFile('./users.json', JSON.stringify(userlist),(err) => {if(err) console.error(err);})

  response.writeHead(200,heads.heade.txt);
  response.write('{}');
  response.end();
}