/*FORM LOGIN*/
const inputs = document.querySelectorAll(".input");

function addcl() {
    let parent = this.parentNode.parentNode;
    parent.classList.add("focus");
}

function remcl() {
    let parent = this.parentNode.parentNode;
    if (this.value == "") {
        parent.classList.remove("focus");
    }
}


inputs.forEach(input => {
    input.addEventListener("focus", addcl);
    input.addEventListener("blur", remcl);
});

/*POP UP*/
/*Regras */

function showregras() {
    document.getElementById("popregras").style.display = "block";
}

function closeregras() {
    document.getElementById("popregras").style.display = "none";
}

/*Resultado */
function showresultado() {
    document.getElementById("popvitorias").style.display = "block";
}

function closeresultado() {
    document.getElementById("popvitorias").style.display = "none";
}

/*Ranking */
function showranking(){
    document.getElementById("popranking").style.display = "block";
}
function closeranking(){
    document.getElementById("popranking").style.display = "none";
}

/*Ganhou */
function showpopganhou(player) {
    document.getElementById("popturn").style.display = "none";
    switch (player) {
        case 1:
            document.getElementById("popdesistiu").style.display = "block";
            document.getElementById("legenda1").innerHTML = "Black forfeits, White Won!";
            break;
        case 2:
            document.getElementById("popdesistiu").style.display = "block";
            document.getElementById("legenda1").innerHTML = "White forfeits, Black Won!";
            break;
        case 3:
            document.getElementById("popganhou").style.display = "block";
            document.getElementById("legenda").innerHTML = "Game over, Black Won!";
            break;
        case 4:
            document.getElementById("popganhou").style.display = "block";
            document.getElementById("legenda").innerHTML = "Game over, White Won!";
            break;
        case 5:
            document.getElementById("popganhou").style.display = "block";
            document.getElementById("legenda").innerHTML = "End of the game, it's a tie!!";
            break;
    }
    document.getElementById("desistir").style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.getElementById("popregras")) {
        document.getElementById("popregras").style.display = "none";
    }
    if (event.target == document.getElementById("popvitorias")) {
        document.getElementById("popvitorias").style.display = "none";
    }
}