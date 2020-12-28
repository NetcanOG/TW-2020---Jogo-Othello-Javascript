module.exports.postRequest = function(req, res, path, query){  
  console.log("pathname: "+path);
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

  console.log("nickname: "+nick+"  password: "+pass);
  //console.log(response);
}