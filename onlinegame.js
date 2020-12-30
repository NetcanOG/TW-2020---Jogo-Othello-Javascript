"use strict";

var url = "http://localhost:8105/";
//var url = "http://twserver.alunos.dcc.fc.up.pt:8008/";
var nick;
var pass;
var group = "5242"; 
var game;
var move;
var color;
var Sevent;
var data;
var moves;
var quit = 0;
var playedOnce = 0;

var table, linha;

function register(){
 nick = document.getElementById("username").value;
 pass = document.getElementById("password").value;

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
      Sevent.close();
    }else{
      console.log(response);
      console.log("Failed to leave");
    }
  })
  playedOnce = 0;
}

function notify(x,y){
  passplay(3);  
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

async function join(){
  await fetch(url + "join",{
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
      showOpOnnline();
      return response.json();
    }
    
    else{
      console.log(response);
      console.log("Couldn't join");
      showmode();
    }
  }).then( json =>{
    game = json.game;
    color = json.color;

    Sevent = new EventSource(url+"update?nick="+nick+"&game="+game); 
    quit=0;
    update();
  })
}

function update(){
  Sevent.onmessage = async event => {
    data = await JSON.parse(event.data);
    
    if(playedOnce == 0){
      grid = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ];
    } else{
      translateBoard();
    }
    playedOnce++;
    refreshBoard();
    getPieceScore();

    passplay(3);
    if(quit!=1){
      if(data.winner != null){
        showpopganhouonline(data.winner, 3,color); //Mensagem vencedor
        leave();
      }else{
        if(data.winner == "null"){
          showpopganhouonline(data.winner, 5,color); //Mensagem Empate
          leave();
        }
      }
    }
    
    if(data.skip == true){
      //console.log("passando");
      notify(null,null);
      if(data.turn == nick){
        passplay(1);
      }else{
        passplay(2);
      }
    }
    
    if(data.turn == nick){
      document.getElementById("Turn").innerHTML = "Your Turn ";   
      /*if(color == "dark"){
        document.getElementById("Turn").innerHTML = "Your Turn (Black)";       
      }else{
        document.getElementById("Turn").innerHTML = "Your Turn (White)";        
      }*/
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
  Sevent.onerror = erro =>{
   console.error(erro);
   playedOnce = 0;
  }
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
function giveup(){
  quit=1;
  if(data.turn == nick){
    if(color == "dark"){
      showpopganhouonline(data.winner, 1, color);
    }else{
      showpopganhouonline(data.winner, 2, color);        
    }
  }else{
    if(color == "dark"){
      showpopganhouonline(data.winner, 1, color);
    }else{
      showpopganhouonline(data.winner, 2, color);        
    }
  }
  leave();
}

function ranking(){
  showranking();
  fetch(url + "ranking",{
    method:"POST", 
    body: JSON.stringify({})
  }).then(async response =>{
    data = await response.json(); 
    console.log(data);
    table = document.getElementById("tabela");

    while(table.firstChild){
      table.removeChild(table.firstChild);
    }
    linha = document.createElement("tr");
    var c1 = document.createElement("th");
    var c2 = document.createElement("th");
    var c3 = document.createElement("th");

    c1.innerHTML="Player";
    c2.innerHTML="Victories";
    c3.innerHTML="Games"

    c1.className = "h2";
    c2.className = "h2";
    c3.className = "h2";
    linha.appendChild(c1);
    linha.appendChild(c2);
    linha.appendChild(c3);
    table.appendChild(linha);

    for (var y = 0; y < 10 && y < data.length; y++) {
      linha = document.createElement("tr");
      for (var x = 0; x < 3; x++) {
            var campo = document.createElement("th");
            var text = document.createElement("h3");
            
            if(x==0){
              text.innerHTML= data[y].nick;
            }else{
              if(x==1)
                text.innerHTML= data[y].victories;
              else 
                text.innerHTML= data[y].games;
            }
            campo.appendChild(text);
            linha.appendChild(campo);
      }
      table.appendChild(linha);
  }
  })
}