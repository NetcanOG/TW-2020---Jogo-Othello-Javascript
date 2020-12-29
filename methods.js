const crypto = require('crypto');
var userlist = [];

module.exports.postRequest = function(req, res, path, query){  
  switch(path){
 
    case('/ranking'):
    //nada ainda
    break;

    case('/register'):
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

    if(err){
      response.writeHead(400, {"Content-Length": body.length, "Content-Type": "text/plain"});
      response.write('{ "error": "Bad Request" }');
      response.end();
      return;
    }else{
      for(var i = 0; i < userlist.length; i++){
        if(userlist[i].nick == nick && userlist[i].pass == hash){
          response.writeHead(200, {"Content-Length": body.length, "Content-Type": "text/plain"});
          response.write('{}');
          response.end();
          return;
        }
        if(userlist[i].nick == nick && userlist[i].pass != hash){
          response.writeHead(401, {"Content-Length": body.length, "Content-Type": "text/plain"});
          response.write('{ "error": "Wrong password" }');
          response.end();
          return;
        }
      }
      addUser(nick, hash);
      response.writeHead(200, {"Content-Length": body.length, "Content-Type": "text/plain"});
      response.write('{}');
      response.end();
    }

  })

  console.log("nickname: "+nick+"  password: "+pass+"  hashed password: "+hash);
  //console.log(response);
}

function addUser(nick, hash){
  const user = {"nick": nick,
                "pass": hash};    
  userlist.push(user);
  fs.writeFile('./users.json', JSON.stringify(userlist),(err) => {if(err) console.error(err);})
}