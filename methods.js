const crypto = require('crypto');
var userlist = [];
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
                "victories" : 0,
                "games":0
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