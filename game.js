"use strict";

var player = 1; //1 para Preto, 2 para Branco
var vsBot = 0; //1 para jogos contra o bot, 0 para jogos entre pessoas
var botDifficulty = 0; //dificuldade do bot, de 1 a 3
var playerColor = 0; //cor do jogador
var botColor = 0; //cor do bot
var playerOneScore = 0; //Score do jogador 1
var playerTwoScore = 0; //Score do jogador 2
var blackScore = 0; //Número de peças pretas
var whiteScore = 0; //Número de peças brancas
var passTimes = 0; //variável para guardar quantas vezes a jogada foi passada num turno (em caso de 2, é Game Over)
var N, NE, E, SE, S, SW, W, NW; //cardinais e intercardinais, usadas para verificar se as direções são válidas nas colocações das peças
var isOnline = 0;

var grid = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
];

var weightGrid = [
    [20, -10, 10, 3, 3, 10, -10, 20],
    [-10, -20, -3, -3, -3, -3, -20, -10],
    [10, -3, 9, 1, 1, 9, -3, 10],
    [3, -3, 1, 1, 1, 1, -3, 3],
    [3, -3, 1, 1, 1, 1, -3, 3],
    [10, -3, 9, 1, 1, 9, -3, 10],
    [-10, -20, -3, -3, -3, -3, -20, -10],
    [20, -10, 10, 3, 3, 10, -10, 20]
];


function createGrid() {
    const gameGrid = document.getElementById("grid");

    for (var y = 0; y < 8; y++) {
        var row;
        row = document.createElement("div");
        row.className = "row";

        for (var x = 0; x < 8; x++) {
            var cell = document.createElement("div");
            cell.className = "cell";
            var piece = document.createElement("div");
            piece.className = "piece";

            cell.setAttribute("id", "cell" + x + y);
            cell.setAttribute("onclick", "selectPiece(" + x + "," + y + ");");
            
            cell.appendChild(piece);
            row.appendChild(cell);
        }
        gameGrid.appendChild(row);
    }
    refreshBoard();
    if (vsBot == 1 && botColor == 1) {
        botTurn();
    }
}

//Faz refresh à Board (automaticamente no início do jogo e depois em cada colocação de peça)
function refreshBoard() {
    for (var tempy = 0; tempy < 8; tempy++) {
        for (var tempx = 0; tempx < 8; tempx++) {
            if (grid[tempx][tempy] == 0) {
                document.getElementById("cell" + tempx + tempy).childNodes[0].style.backgroundColor = "#007D15";
            } else if (grid[tempx][tempy] == 1) {
                document.getElementById("cell" + tempx + tempy).childNodes[0].style.backgroundColor = "#000000";
            } else if (grid[tempx][tempy] == 2) {
                document.getElementById("cell" + tempx + tempy).childNodes[0].style.backgroundColor = "#FFFFFF";
            }
        }
    }
}


//Adiciona uma peça, depois de verificar que é uma posição válida
function selectPiece(x, y) {

    if(isOnline == 1){
      selectOnlinePiece(x,y);
      return 0;
    }

    document.getElementById("popturn").style.display = "none";
    passTimes = 0;
    var played = 0;

    //player 1, peças pretas
    if ((player == 1) && validPiece(x, y) >= 1) {
        grid[x][y] = 1;
        switchPieces(x, y);
        played = 1;
        player = 2;
        refreshBoard();
        document.getElementById("Turn").innerHTML = "White Turn";
        if (checkPass() == 1) { //verifica todas as jogadas possíveis do adversário e se não existirem, passa o controlo de volta
            player = 1;
            played = 0;
            document.getElementById("Turn").innerHTML = "Black Turn";
            passTimes++;
            document.getElementById("popturn").style.display = "block";
            document.getElementById("legenda2").innerHTML = "Turn passed to Black";
            //alert("Turn passed to Black");
            if (checkPass() == 1) { //se passar duas vezes seguidas, o jogo termina porque nenhum jogador tem jogadas válidas
                endGame(0);
                return;
            }
        }
        getPieceScore();
        //mudar o inner html do numero das peças
    }

    //player 2, peças brancas
    else if ((player == 2) && validPiece(x, y) >= 1) {
        grid[x][y] = 2;
        switchPieces(x, y);
        played = 1;
        player = 1;
        refreshBoard();
        document.getElementById("Turn").innerHTML = "Black Turn";

        if (checkPass() == 1) {
            player = 2;
            played = 0;
            document.getElementById("Turn").innerHTML = "Black Turn";
            passTimes++;
            document.getElementById("popturn").style.display = "block";
            document.getElementById("legenda2").innerHTML = "Turn passed to White";
            //alert("Turn passed to White");
            if (checkPass() == 1) {
                endGame(0);
                return;
            }
        }
        getPieceScore();
        //mudar o inner html do numero das peças
    }

    //se o jogador fez a sua jogada e está a lutar contra um bot, então dá a vez ao computador
    if (played == 1 && vsBot == 1) {
        botTurn();
    }
}

//verificamos a validade das direções, 0 se a dreção não for válida, 1 ou mais para o número de peças que podem ser alteradas
function validPiece(x, y) {

    if ((grid[x][y] == 0) && (checkAround(x, y) == 1)) {
        N = checkN(x, y, 0);
        NE = checkNE(x, y, 0);
        E = checkE(x, y, 0);
        SE = checkSE(x, y, 0);
        S = checkS(x, y, 0);
        SW = checkSW(x, y, 0);
        W = checkW(x, y, 0);
        NW = checkNW(x, y, 0);
        if ((N == 0) && (NE == 0) && (E == 0) && (SE == 0) && (S == 0) && (SW == 0) && (W == 0) && (NW == 0)) {
            return 0;
        }
        return N + NE + E + SE + S + SW + W + NW;
    } else if ((grid[x][y] != 0) || (checkAround(x, y) == 0)) {
        return 0;
    }
}

//verifica as peças à volta da coordenada (x,y), retorna 1 se for uma posição válida, 0 se não
function checkAround(x, y) {
    for (var tempy = y - 1; tempy <= y + 1; tempy++) {
        for (var tempx = x - 1; tempx <= x + 1; tempx++) {
            if (tempx >= 0 && tempy >= 0 && tempx <= 7 && tempy <= 7) {
                if (((grid[tempx][tempy] == 2) && (player == 1)) || ((grid[tempx][tempy] == 1) && (player == 2))) {
                    return 1;
                }
            }
        }
    }
    return 0;
}

//troca as peças consoante os valores guardados nas variáveis globais para o jogador correspondente
function switchPieces(x, y) {
    if (N != 0) {
        for (var i = 1; i <= N; i++) {
            grid[x][y - i] = player;
        }
    }
    if (NE != 0) {
        for (var i = 1; i <= NE; i++) {
            grid[x + i][y - i] = player;
        }
    }
    if (E != 0) {
        for (var i = 1; i <= E; i++) {
            grid[x + i][y] = player;
        }
    }
    if (SE != 0) {
        for (var i = 1; i <= SE; i++) {
            grid[x + i][y + i] = player;
        }
    }
    if (S != 0) {
        for (var i = 1; i <= S; i++) {
            grid[x][y + i] = player;
        }
    }
    if (SW != 0) {
        for (var i = 1; i <= SW; i++) {
            grid[x - i][y + i] = player;
        }
    }
    if (W != 0) {
        for (var i = 1; i <= W; i++) {
            grid[x - i][y] = player;
        }
    }
    if (NW != 0) {
        for (var i = 1; i <= NW; i++) {
            grid[x - i][y - i] = player;
        }
    }
}


//verifica todas as peças do tabuleiro e se não ouverem posições válidas, retorna 1 para passar o turno
function checkPass() {
    for (var row = 0; row < 8; row++) {
        for (var col = 0; col < 8; col++) {
            if (validPiece(row, col) >= 1) {
                return 0;
            }
        }
    }
    return 1;
}

function getPieceScore() {
    blackScore = 0;
    whiteScore = 0;

    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            if (grid[i][j] == 1) {
                blackScore++;
            } else if (grid[i][j] == 2) {
                whiteScore++;
            }
        }
    }
    document.getElementById("pontjpreto").innerHTML = blackScore;
    document.getElementById("pontjbranco").innerHTML = whiteScore;
}

function resetGame() {
    document.getElementById("Turn").innerHTML = "Black Turn";
    document.getElementById("popdesistiu").style.display = "none";
    document.getElementById("popganhou").style.display = "none";
    document.getElementById("desistir").style.display = "block";

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

    player = 1;
    refreshBoard();
    if (vsBot == 1 && botColor == 1) {
        botTurn();
        refreshBoard();
    }
    getPieceScore();

}


function endGame(forfeitFlag) {

    if (forfeitFlag == 0) {
        getPieceScore();
        if (blackScore > whiteScore) {
            showpopganhou(3);
            playerOneScore++;
            document.getElementById("vitoriaspreto").innerHTML = playerOneScore;
        } else if (whiteScore > blackScore) {
            showpopganhou(4);
            playerTwoScore++;
            document.getElementById("vitoriasbranco").innerHTML = playerTwoScore;
        } else if (whiteScore == blackScore) {
            showpopganhou(5);
        }
    } else if (forfeitFlag == 1) {
        if (player == 1) {
            showpopganhou(1);
            playerTwoScore++;
            document.getElementById("vitoriasbranco").innerHTML = playerTwoScore;
        } else if (player == 2) {
            showpopganhou(2);
            playerOneScore++;
            document.getElementById("vitoriaspreto").innerHTML = playerOneScore;
        }
    }
}
/*----------------------------------- AI ------------------------------------ */

function botTurn() {
    document.getElementById("popturn").style.display = "none";
    switch (botDifficulty) {

        case 1: //AI Easy - Escolhe uma peça ao calhas que seja válida
            var randx = Math.floor(Math.random() * 8);
            var randy = Math.floor(Math.random() * 8);

            while (validPiece(randx, randy) == 0) {
                randx = Math.floor(Math.random() * 8);
                randy = Math.floor(Math.random() * 8);
            }
            grid[randx][randy] = player;
            switchPieces(randx, randy);

            break;

        case 2: //AI Medium - Escolhe a peça que "come" mais peças adversárias
            var max = 0,
                cur = 0,
                maxx = 0,
                maxy = 0;

            for (var tempy = 0; tempy < 8; tempy++) {
                for (var tempx = 0; tempx < 8; tempx++) {
                    cur = validPiece(tempx, tempy);
                    if (cur > max) {
                        max = cur;
                        maxx = tempx;
                        maxy = tempy;
                    }
                }
            }

            if (max > 0) {
                validPiece(maxx, maxy);
                grid[maxx][maxy] = player;
                switchPieces(maxx, maxy);
            }

            break;

        case 3: //AI Hard - Igual ao médio mas adicionado ao valor de máx o peso relativo da posição através da grid de pesos
            var max = -99,
                cur = 0,
                maxx = 0,
                maxy = 0;

            for (var tempy = 0; tempy < 8; tempy++) {
                for (var tempx = 0; tempx < 8; tempx++) {
                    cur = validPiece(tempx, tempy);
                    if (cur > 0) {
                        weightGrid[tempx][tempy] = cur + weightGrid[tempx][tempy];
                    } else if (cur == 0) {
                        weightGrid[tempx][tempy] = "F";
                    }
                }
            }

            for (var tempy = 0; tempy < 8; tempy++) {
                for (var tempx = 0; tempx < 8; tempx++) {
                    if ((weightGrid[tempx][tempy] > max) && (weightGrid[tempx][tempy] != "F")) {
                        max = weightGrid[tempx][tempy];
                        maxx = tempx;
                        maxy = tempy;
                    }
                }
            }

            if (max != -99) {
                validPiece(maxx, maxy);
                grid[maxx][maxy] = player;
                switchPieces(maxx, maxy);
            }
            resetWeightedGrid();
            break;
    }

    passTimes = 0;

    if (botColor == 1) {
        player = 2;
        refreshBoard();
        document.getElementById("Turn").innerHTML = "White Turn";
        if (checkPass() == 1) {
            player = 1;
            document.getElementById("Turn").innerHTML = "Black Turn";
            passTimes++;
            document.getElementById("popturn").style.display = "block";
            document.getElementById("legenda2").innerHTML = "Turn passed to Black";
            //alert("Turn passed to Black");
            if (checkPass() == 1) {
                endGame(0);
                return;
            }
            botTurn();
        }
    } else if (botColor == 2) {
        player = 1;
        refreshBoard();
        document.getElementById("Turn").innerHTML = "Black Turn";
        if (checkPass() == 1) {
            player = 2;
            document.getElementById("Turn").innerHTML = "White Turn";
            passTimes++;
            document.getElementById("popturn").style.display = "block";
            document.getElementById("legenda2").innerHTML = "Turn passed to White";
            //alert("Turn passed to White");
            if (checkPass() == 1) {
                endGame(0);
                return;
            }
            botTurn();
        }
    }
    getPieceScore();
}

function resetWeightedGrid() {
    weightGrid = [
        [20, -10, 10, 3, 3, 10, -10, 20],
        [-10, -20, -3, -3, -3, -3, -20, -10],
        [10, -3, 9, 1, 1, 9, -3, 10],
        [3, -3, 1, 1, 1, 1, -3, 3],
        [3, -3, 1, 1, 1, 1, -3, 3],
        [10, -3, 9, 1, 1, 9, -3, 10],
        [-10, -20, -3, -3, -3, -3, -20, -10],
        [20, -10, 10, 3, 3, 10, -10, 20]
    ];
}
/*--------------------------------------------------------------------------- */

/*----------------------------- Direction Check ----------------------------- */

function checkN(x, y, overOne) {
    if ((y - 1) < 0) {
        //a posição está fora do tabuleiro, como não parou antes é porque não é uma direção válida
        return 0;
    } else if (grid[x][y - 1] == 0) {
        //a posição está vazia, como não parou antes é porque não é uma direção válida
        return 0;
    } else if ((grid[x][y - 1] == player) && (overOne == 0)) {
        //encontrou outra peça da mesma cor mas não existem peças adversárias entre as duas, a direção é inválida 
        return 0;
    } else if (grid[x][y - 1] != player) {
        //encontra uma peça adversária, continua a verificar a direção
        overOne++;
        return checkN(x, y - 1, overOne);
    }
    //caso onde encontra uma peça da mesma cor e estando overOne >= 1, sabe que existem overOne peças adversárias entre as duas 
    return overOne;
}

function checkNE(x, y, overOne) {
    if (((y - 1) < 0) || ((x + 1) > 7)) {
        return 0;
    } else if (grid[x + 1][y - 1] == 0) {
        return 0;
    } else if ((grid[x + 1][y - 1] == player) && (overOne == 0)) {
        return 0;
    } else if (grid[x + 1][y - 1] != player) {
        overOne++;
        return checkNE(x + 1, y - 1, overOne);
    }
    return overOne;
}

function checkE(x, y, overOne) {
    if ((x + 1) > 7) {
        return 0;
    } else if (grid[x + 1][y] == 0) {
        return 0;
    } else if ((grid[x + 1][y] == player) && (overOne == 0)) {
        return 0;
    } else if (grid[x + 1][y] != player) {
        overOne++;
        return checkE(x + 1, y, overOne);
    }
    return overOne;
}

function checkSE(x, y, overOne) {
    if (((y + 1) > 7) || ((x + 1) > 7)) {
        return 0;
    } else if (grid[x + 1][y + 1] == 0) {
        return 0;
    } else if ((grid[x + 1][y + 1] == player) && (overOne == 0)) {
        return 0;
    } else if (grid[x + 1][y + 1] != player) {
        overOne++;
        return checkSE(x + 1, y + 1, overOne);
    }
    return overOne;
}

function checkS(x, y, overOne) {
    if ((y + 1) > 7) {
        return 0;
    } else if (grid[x][y + 1] == 0) {
        return 0;
    } else if ((grid[x][y + 1] == player) && (overOne == 0)) {
        return 0;
    } else if (grid[x][y + 1] != player) {
        overOne++;
        return checkS(x, y + 1, overOne);
    }
    return overOne;
}

function checkSW(x, y, overOne) {
    if (((y + 1) > 7) || ((x - 1) < 0)) {
        return 0;
    } else if (grid[x - 1][y + 1] == 0) {
        return 0;
    } else if ((grid[x - 1][y + 1] == player) && (overOne == 0)) {
        return 0;
    } else if (grid[x - 1][y + 1] != player) {
        overOne++;
        return checkSW(x - 1, y + 1, overOne);
    }
    return overOne;
}

function checkW(x, y, overOne) {
    if ((x - 1) < 0) {
        return 0;
    } else if (grid[x - 1][y] == 0) {
        return 0;
    } else if ((grid[x - 1][y] == player) && (overOne == 0)) {
        return 0;
    } else if (grid[x - 1][y] != player) {
        overOne++;
        return checkW(x - 1, y, overOne);
    }
    return overOne;
}

function checkNW(x, y, overOne) {
    if (((y - 1) < 0) || ((x - 1) < 0)) {
        return 0;
    } else if (grid[x - 1][y - 1] == 0) {
        return 0;
    } else if ((grid[x - 1][y - 1] == player) && (overOne == 0)) {
        return 0;
    } else if (grid[x - 1][y - 1] != player) {
        overOne++;
        return checkNW(x - 1, y - 1, overOne);
    }
    return overOne;
}
/*--------------------------------------------------------------------------- */