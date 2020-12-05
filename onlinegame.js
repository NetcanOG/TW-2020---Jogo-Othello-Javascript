"use strict";

var url = "http://twserver.alunos.dcc.fc.up.pt:8008/";
var nick;
var pass;
var group = "5242"; 
var game;
var move;
var color;
var Sevent;
var data;
var moves;

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
   }else{
     alert("Wrong password");
     document.getElementById("password").value="";
   }
 })
}

function leave(){
  fetch(url + "leave",{
    method: "POST",
    body: JSON.stringify({
      "nick": nick,
      "pass": pass,
      "game": game
    })
  }).then(response => {
    if(response.ok){
      console.log(response);
    }else{
      console.log(response);
      alert("Failed to leave");
    }
  })
}


function notify(x,y){
  if(x == null && y == null){
    moves = null;
  }else{
    moves = {"row": x, "column": y}
  }

  fetch(url + "notify",{
    method: "POST",
    body: JSON.stringify({
      "nick": nick,
      "pass": pass,
      "game": game,
      "move": moves
    })
  }).then(response => {
    if(response.ok){
      console.log(response);
    }else{
      console.log(response);
      console.log(nick+" passes")
    }
    update();
  })
}

function join(){
  fetch(url + "join",{
    method: "POST",
    body: JSON.stringify({
      "group": group,
      "nick": nick,
      "pass": pass
    })
  }).then(response => {
    
    if(response.ok){
      console.log(response);
      //showgame(1);
      isOnline = 1;
      return response.json();
    }
    
    else{
      console.log(response);
      alert("Couldn't join");
    }
  }).then( json =>{
    game = json.game;
    color = json.color;

    Sevent = new EventSource(url+"update?nick="+nick+"&game="+game); 
    update();
    showOpOnnline();
  })
}

function update(){
  Sevent.onmessage = async event => {
    data = await JSON.parse(event.data);
    
    translateBoard();
    refreshBoard();
    getPieceScore();
    
    if(data.winner != null){
      alert(data.winner +" wins!");
      showpopganhouonline(data.winner, 3); //Mensagem vencedor
      leave();
    }

    

    if(data.skip == true){
      console.log("passando");
      notify(null,null);
    }
    
    if(data.turn == nick){
      if(color == "dark"){
        document.getElementById("Turn").innerHTML = "Your Turn (Black)";       
      }else{
        document.getElementById("Turn").innerHTML = "Your Turn (White)";        
      }
    }else{
      if(color == "dark"){
        document.getElementById("Turn").innerHTML = "White Turn";
      }
      else{
        document.getElementById("Turn").innerHTML = "Black Turn";
      }
    }
    console.log(data);
  }
  Sevent.onerror = erro => console.error(erro);
}


async function translateBoard(){
  for(var x = 0; x < 8; x++){
    for(var y = 0; y < 8; y++){
      if(data.board[x][y] == "empty"){
        grid[x][y] = 0;
      } else if(data.board[x][y] == "dark"){
        grid[x][y] = 1;
      } else if(data.board[x][y] == "light"){
        grid[x][y] = 2;
      }
    }
  }
}

function selectOnlinePiece(x,y){
  translateBoard();
  if(data.turn == nick){
    switch (color) {
      case "dark":
      player = 1;
      break;
    
      case "light":
      player = 2;
    }
  } else if(data.turn != nick){
    switch (color) {
      case "dark":
      player = 2;
      break;
    
      case "light":
      player = 1;
    }
  }

  if(data.turn == nick && validPiece(x,y) >= 1){
    notify(x,y);
    update();
  }
}

function ranking(){
  showranking();
  fetch(url + "ranking",{
    method:"POST", 
    body: JSON.stringify({})
  }).then(async response =>{
    data = await response.json(); 
    console.log(data);
    const tabelarank = document.getElementById("tabela");
    for (var y = 0; y < 10; y++) {
      var linha;
      linha = document.createElement("tr");

      for (var x = 0; x < 3; x++) {
            var campo = document.createElement("th");
            var text = document.createElement("h3");
            
            if(x==0){
              text.innerHTML= data.ranking[y].nick;
            }else{
              if(x==1)
                text.innerHTML= data.ranking[y].victories;
              else 
                text.innerHTML= data.ranking[y].games;
            }
            campo.appendChild(text);
            linha.appendChild(campo);
      }
      tabelarank.appendChild(linha);
  }
  })
}