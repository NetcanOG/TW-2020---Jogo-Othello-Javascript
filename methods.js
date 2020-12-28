methods.exports.postRequest = function(req, res, pathname, query){
  switch(pathname){

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
  console.log(response);
}