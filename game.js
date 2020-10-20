"use strict";

var player=1; //1 for Black, 2 for White
var grid = [
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,2,1,0,0,0],
  [0,0,0,1,2,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0]
];


//Adiciona uma peça, depois de verificar que é uma posição válida
function selectPiece(y,x) {
   
  if ((player==1) && (grid[y][x]==0)) {
    grid[y][x]=1;
    player=2;
    document.getElementById("Turn").innerHTML="White Turn";
  } else if ((player==2) && (grid[y][x]==0)) {
    grid[y][x]=2;
    player=1;
    document.getElementById("Turn").innerHTML="Black Turn";
  }
  
  refreshBoard();
}


//Faz refresh à Board (automaticamente no início do jogo e depois em cada colocação de peça)
function refreshBoard() {
  for (var row = 0; row < 8; row++) {
    for (var col = 0; col < 8; col++) {
      if (grid[row][col]==0) { 
                document.getElementById("cell"+row+col).childNodes[0].style.backgroundColor="green";
      } else if (grid[row][col]==1) { //1 for black
                document.getElementById("cell"+row+col).childNodes[0].style.backgroundColor="#000000";
      } else if (grid[row][col]==2) { //2 for white
                document.getElementById("cell"+row+col).childNodes[0].style.backgroundColor="#FFFFFF";
      }
    }
  }  
}