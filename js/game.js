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

var passTimes = 0;

//cardinais e intercardinais, usadas para verificar se as direções são válidas nas colocações das peças
var N, NE, E, SE, S, SW, W, NW; 

function createGrid(){
  const gameGrid = document.getElementById("grid");

  for(var y = 0; y < 8; y++){
    var row;
    row = document.createElement("div");
    row.className = "row";

    for(var x = 0; x < 8; x++){
      var cell = document.createElement("div");
      cell.className = "cell";
      var piece = document.createElement("div");
      piece.className = "piece";

      cell.setAttribute("id", "cell"+x+y);
      cell.setAttribute("onclick", "selectPiece("+x+","+y+");");
      cell.appendChild(piece);
      row.appendChild(cell);
    }
    gameGrid.appendChild(row);
  }

  refreshBoard();
}

//Faz refresh à Board (automaticamente no início do jogo e depois em cada colocação de peça)
function refreshBoard() {
  for (var tempy = 0; tempy < 8; tempy++) {
    for (var tempx = 0; tempx < 8; tempx++) {
      if (grid[tempx][tempy]==0) { 
        document.getElementById("cell"+tempx+tempy).childNodes[0].style.backgroundColor="green";
      } else if (grid[tempx][tempy]==1){
        document.getElementById("cell"+tempx+tempy).childNodes[0].style.backgroundColor="#000000";
      } else if (grid[tempx][tempy]==2){
        document.getElementById("cell"+tempx+tempy).childNodes[0].style.backgroundColor="#FFFFFF";
      }
    }
  }  
}

//Adiciona uma peça, depois de verificar que é uma posição válida
function selectPiece(x,y){
  passTimes = 0;

  //player 1, peças pretas
  if ((player == 1) && validPiece(x,y) == 1) {
    grid[x][y]=1;
    switchPieces(x,y);
    player=2;
    refreshBoard();
    document.getElementById("Turn").innerHTML="White Turn";

    if(checkPass() == 1){ //verificação e passar o turno
      player = 1;
      document.getElementById("Turn").innerHTML="Black Turn";
      passTimes++;
      setTimeout(() => {alert("Turn passed to Black");}, 300);

      if(checkPass() == 1){ //verifica se vai passar outra vez
        setTimeout(() => {endGame();}, 800);
      }
    }
  }
  //player 2, peças brancas
  else if ((player == 2) && validPiece(x,y) == 1) {
    grid[x][y]=2;
    switchPieces(x,y);
    player=1;
    refreshBoard();
    document.getElementById("Turn").innerHTML="Black Turn";

    if(checkPass() == 1){ //verificação e passar o turno
      player = 2;
      document.getElementById("Turn").innerHTML="White Turn";
      passTimes++;
      setTimeout(() => {alert("Turn passed to White");}, 300);

      if(checkPass() == 1){ //verifica se vai passar outra vez
        setTimeout(() => {endGame();}, 800);
      }
    }
  }
}

function validPiece(x,y){
  if((grid[x][y] == 0) && (checkAround(x,y) == 1)){
    //verificamos a validade das direções, 0 se a dreção não for válida, 1 ou mais para o número de peças que podem ser alteradas
    N = checkN(x,y,0);
    NE = checkNE(x,y,0);
    E = checkE(x,y,0);
    SE = checkSE(x,y,0);
    S = checkS(x,y,0);
    SW = checkSW(x,y,0);
    W = checkW(x,y,0);
    NW = checkNW(x,y,0);
    if( (N == 0) && (NE == 0) && (E == 0) && (SE == 0) && (S == 0) && (SW == 0) && (W == 0) && (NW == 0) ){  
      return 0;
    }
    return 1;
  }
}

//verifica as peças à volta da coordenada (x,y), retorna 1 se for uma posição válida, 0 se não
function checkAround(x,y){
  for(var tempy = y-1; tempy <= y+1; tempy++){
    for( var tempx = x-1; tempx <= x+1; tempx++){
      if(tempx >= 0 && tempy >= 0 && tempx <= 7 && tempy <= 7){
        if( ((grid[tempx][tempy] == 2) && (player == 1)) || ((grid[tempx][tempy] == 1) && (player == 2)) ){
          return 1;
        }
      }
    }
  }
  return 0;
}

//troca as peças consoante os valores guardados nas variáveis globais para o jogador correspondente
function switchPieces(x,y){
  if(N != 0){
    for(var i = 1; i <= N; i++){
      grid[x][y-i] = player;
    }
  }
  if(NE != 0){
    for(var i = 1; i <= NE; i++){
      grid[x+i][y-i] = player;
    }
  }
  if(E != 0){
    for(var i = 1; i <= E; i++){
      grid[x+i][y] = player;
    }
  }
  if(SE != 0){
    for(var i = 1; i <= SE; i++){
      grid[x+i][y+i] = player;
    }
  }
  if(S != 0){
    for(var i = 1; i <= S; i++){
      grid[x][y+i] = player;
    }
  }
  if(SW != 0){
    for(var i = 1; i <= SW; i++){
      grid[x-i][y+i] = player;
    }
  }
  if(W != 0){
    for(var i = 1; i <= W; i++){
      grid[x-i][y] = player;
    }
  }
  if(NW != 0){
    for(var i = 1; i <= NW; i++){
      grid[x-i][y-i] = player;
    }
  }
}


//verifica todas as peças do tabuleiro e se não ouverem posições válidas, retorna 1 para passar o turno
function checkPass(){
  for(var row = 0; row < 8; row++){
    for(var col = 0; col < 8; col++){
      if(validPiece(row,col) == 1){
        return 0;
      }
    }
  }
  return 1;
}

function endGame(){
  alert("Game Over");
}

/*----------------------------- Direction Check ----------------------------- */

function checkN(x,y,overOne){
  if((y-1) < 0){
    //a posição está fora do tabuleiro, como não parou antes é porque não é uma direção válida
    return 0;
  } else if(grid[x][y-1] == 0){
    //a posição está vazia, como não parou antes é porque não é uma direção válida
    return 0;
  } else if((grid[x][y-1] == player) && (overOne == 0)){
    //encontrou outra peça da mesma cor mas não existem peças adversárias entre as duas, a direção é inválida 
    return 0;
  } else if(grid[x][y-1] != player){
    //encontra uma peça adversária, continua a verificar a direção
    overOne++;
    return checkN(x,y-1,overOne);
  }
  //caso onde encontra uma peça da mesma cor e estando overOne >= 1, sabe que existem overOne peças adversárias entre as duas 
  return overOne;
}

function checkNE(x,y,overOne){
  if(((y-1) < 0) || ((x+1) > 7)){
    return 0;
  } else if(grid[x+1][y-1] == 0){
    return 0;
  } else if((grid[x+1][y-1] == player) && (overOne == 0)){
    return 0;
  } else if(grid[x+1][y-1] != player){
    overOne++;
    return checkNE(x+1,y-1,overOne);
  }
  return overOne;
}

function checkE(x,y,overOne){
  if((x+1) > 7){
    return 0;
  } else if(grid[x+1][y] == 0){
    return 0;
  } else if((grid[x+1][y] == player) && (overOne == 0)){
    return 0;
  } else if(grid[x+1][y] != player){
    overOne++;
    return checkE(x+1,y,overOne);
  }
  return overOne;
}

function checkSE(x,y,overOne){
  if(((y+1) > 7) || ((x+1) > 7)){
    return 0;
  } else if(grid[x+1][y+1] == 0){
    return 0;
  } else if((grid[x+1][y+1] == player) && (overOne == 0)){
    return 0;
  } else if(grid[x+1][y+1] != player){
    overOne++;
    return checkSE(x+1,y+1,overOne);
  }
  return overOne;
}

function checkS(x,y,overOne){
  if((y+1) > 7){
    return 0;
  } else if(grid[x][y+1] == 0){
    return 0;
  } else if((grid[x][y+1] == player) && (overOne == 0)){
    return 0;
  } else if(grid[x][y+1] != player){
    overOne++;
    return checkS(x,y+1,overOne);
  }
  return overOne;
}

function checkSW(x,y,overOne){
  if(((y+1) > 7) || ((x-1) < 0)){
    return 0;
  } else if(grid[x-1][y+1] == 0){
    return 0;
  } else if((grid[x-1][y+1] == player) && (overOne == 0)){
    return 0;
  } else if(grid[x-1][y+1] != player){
    overOne++;
    return checkSW(x-1,y+1,overOne);
  }
  return overOne;
}

function checkW(x,y,overOne){
  if((x-1) < 0){
    return 0;
  } else if(grid[x-1][y] == 0){
    return 0;
  } else if((grid[x-1][y] == player) && (overOne == 0)){
    return 0;
  } else if(grid[x-1][y] != player){
    overOne++;
    return checkW(x-1,y,overOne);
  }
  return overOne;
}

function checkNW(x,y,overOne){
  if(((y-1) < 0) || ((x-1) < 0)){
    return 0;
  } else if(grid[x-1][y-1] == 0){
    return 0;
  } else if((grid[x-1][y-1] == player) && (overOne == 0)){
    return 0;
  } else if(grid[x-1][y-1] != player){
    overOne++;
    return checkNW(x-1,y-1,overOne);
  }
  return overOne;
}
/*--------------------------------------------------------------------------- */

/*----------------------------------- AI ------------------------------------ */



/*--------------------------------------------------------------------------- */