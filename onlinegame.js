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
     document.getElementById("password").value="";
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
      alert("Notify error");
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
      alert("Couldn't join");
    }
  }).then( json =>{
    game = json.game;
    color = json.color;
  
    update();
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
    }
    else{
      console.log(response);
      alert("Failed to leave");
    }
  })
}

function ranking(){
  showranking();
  fetch(url + "ranking",{
    method:"POST", 
    body: JSON.stringify({})
  }).then(async response =>{

    const data = await response.json(); 
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
            }
            else {
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


function update(){
  const Sevent= new EventSource(url+"update?nick="+nick+"&game="+game); 

  Sevent.onstart = () => console.log("Conectado");
  Sevent.onmessage = async event => {
    const data= JSON.parse(event.data);
    if(Sevent.winner){
      //vencedorfunçao
      Sevent.close();
    }
    //await notify();
    //atualizar board
    console.log(data);
  }
  Sevent.onerror= erro => console.error(erro);
  console.log("update");
}

var board = [
  ["empty","empty","empty","empty","empty","empty","empty","empty"],
  ["empty","empty","empty","empty","empty","empty","empty","empty"],
  ["empty","empty","empty","empty","empty","empty","empty","empty"],
  ["empty","empty","empty","light","dark" ,"empty","empty","empty"],
  ["empty","empty","empty","dark", "light","empty","empty","empty"],
  ["empty","empty","empty","empty","empty","empty","empty","empty"],
  ["empty","empty","empty","empty","empty","empty","empty","empty"],
  ["empty","empty","empty","empty","empty","empty","empty","empty"]     
];

