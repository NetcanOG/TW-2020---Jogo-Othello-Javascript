"use strict";

var url = "http://twserver.alunos.dcc.fc.up.pt:8008/";
var nick;
var pass;
var group = "5242";
var game;
var move;
var color;


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


function notify(){

  fetch(url + "notify",{
    method: "POST",
    body: JSON.stringify({
      "nick": nick,
      "pass": pass,
      "game": game,
      "move": null
    })
  }).then(response => {
    if(response.ok){
      console.log(response);
    }
    else{
      console.log(response);
      alert("Wrong password");
    }
    
    update();
  })
}


function join(){
  
  fetch(url + "join",{
    method: "POST",
    body: JSON.stringify({
      "nick": nick,
      "pass": pass,
      "group": group
    })
  }).then(response => {
    
    if(response.ok){
      console.log(response);
      showgame(1);
      return response.json();
    }
    
    else{
      console.log(response);
      alert("Wrong password");
    }
  }).then( json =>{
    
    game = json.game;
    color = json.color;
    setOnline(color);
    
    update();
  })
}

function update(){

  console.log("update");
}