"use strict";

var url = "http://twserver.alunos.dcc.fc.up.pt:8008/";
var nick;
var pass;
var roomid = "5242";

function register(){

 nick = document.getElementById("username").value;
 pass = document.getElementById("password").value;

 console.log("username = "+nick);
 console.log("password = "+pass);

 fetch(url + "register",{
   method: "POST",
   body: JSON.stringify({
     "nick": nick,
     "pass": pass
   })
 }).then(response => {
   if(response.ok){
     console.log(response);
     showmode();
   }
   else{
     alert("Wrong password");
   }
 })
}