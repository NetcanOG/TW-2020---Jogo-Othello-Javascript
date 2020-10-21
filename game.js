"use strict";

var player=1; //1 para Preto, 2 para Branco
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

//cardinais e intercardinais, usadas para verificar se as direções são válidas nas colocações das peças
var N, NE, E, SE, S, SW, W, NW; 

//Adiciona uma peça, depois de verificar que é uma posição válida
function selectPiece(y,x) {
   
  //player 1, peças pretas
  if ((player == 1) && validPiece(y,x) == 1) {
    grid[y][x]=1;
    player=2;
    document.getElementById("Turn").innerHTML="White Turn";
  }
  //player 2, peças brancas
  else if ((player == 2) && validPiece(y,x) == 1) {
    grid[y][x]=2;
    player=1;
    document.getElementById("Turn").innerHTML="Black Turn";
  }
  
  refreshBoard();
}


function validPiece(y,x){
  //player 1, peças pretas
  if((grid[y][x] == 0) && (checkAround(y,x) == 1)){
    //verificamos a validade das direções, 0 se a dreção não for válida, 1 ou mais para o número de peças que podem ser alteradas
    /*
    N = checkN(y,x,0);
    NE = checkNE(y,x,0);
    E = checkE(y,x,0);
    SE = checkSE(y,x,0);
    S = checkS(y,x,0);
    SW = checkSW(y,x,0);
    W = checkW(y,x,0);
    NW = checkNW(y,x,0);
    
    if( (N == 0) || (NE == 0) || (E == 0) || (SE == 0) || (S == 0) || (SW == 0) || (W == 0) || (NW == 0) ){
      return 0;
    }*/

    return 1;
  }
  //player 2, peças brancas
  else if((grid[y][x] == 0) && (checkAround(y,x) == 1)){
   /*
    N = checkN(y,x);
    NE = checkNE(y,x);
    E = checkE(y,x);
    SE = checkSE(y,x);
    S = checkS(y,x);
    SW = checkSW(y,x);
    W = checkW(y,x);
    NW = checkNW(y,x);
     
    if( (N == 0) || (NE == 0) || (E == 0) || (SE == 0) || (S == 0) || (SW == 0) || (W == 0) || (NW == 0) ){
      return 0;
    }
*/
    return 1;
  }
}

//verifica as peças à volta da coordenada (y,x), retorna 0 se for uma posição válida, 1 se não
function checkAround(y,x){
  for(var tempy = y-1; tempy <= y+1; tempy++){
    for( var tempx = x-1; tempx <= x+1; tempx++){
      if(tempx >= 0 && tempy >= 0){
        if( ((grid[tempy][tempx] == 2) && (player == 1)) || ((grid[tempy][tempx] == 1) && (player == 2)) ){
          return 1;
        }
      }
    }
  }
  return 0;
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

function checkN(y,x,overOne){
  if((y-1) < 0){
    //a posição está fora do tabuleiro, como não parou antes é porque não é uma direção válida
    return 0;
  } else if(grid[y-1][x] == 0){
    //a posição está vazia, como não parou antes é porque não é uma direção válida
    return 0;
  } else if((grid[y-1][x] == player) && (overOne == 0)){
    //encontrou outra peça da mesma cor mas não existem peças adversárias entre as duas, a direção é inválida 
    return 0;
  } else if(grid[y-1][x] != player){
    //encontra uma peça adversária, continua a verificar a direção
    overOne++;
    return checkN(y-1,x,overOne);
  }
  //caso onde encontra uma peça da mesma cor e estando overOne == 1, sabe que existem overOne peças adversárias entre as duas 
  return overOne;
}

/*
function checkNE(y,x,overOne){
  return 0;
}
function checkE(y,x,overOne){
  return 0;
}
function checkSE(y,x,overOne){
  return 0;
}
function checkS(y,x,overOne){
  return 0;
}
function checkSW(y,x,overOne){
  return 0;
}
function checkW(y,x,overOne){
  return 0;
}
function checkNW(y,x,overOne){
  return 0;
}
*/