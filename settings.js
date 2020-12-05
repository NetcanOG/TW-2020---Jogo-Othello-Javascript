"use strict";

function showbegin() {
  leave();
  location.reload();
}

function showlogin() {
    document.getElementById("spage").style.display = "none";
    document.getElementById("header").style.display = "block";
    document.getElementById("loginform").style.display = "block";

}

function showmode() {
    document.getElementById("loginform").style.display = "none";
    document.getElementById("modebutton").style.display = "block";
    document.getElementById("difficulty").style.display = "none";
}

function showdif(bot) {
    document.getElementById("modebutton").style.display = "none";
    document.getElementById("difficulty").style.display = "block";
    document.getElementById("color").style.display = "none";
    vsBot = bot;
}

function showcolor(diff) {
    document.getElementById("color").style.display = "block";
    document.getElementById("difficulty").style.display = "none";
    botDifficulty = diff;
}

function showgame(color) {
    document.getElementById("header").style.display = "none";
    document.getElementById("headerjogo").style.display = "block";
    document.getElementById("modebutton").style.display = "none";
    document.getElementById("color").style.display = "none";
    document.getElementById("game").style.display = "block";
    playerColor = color;
    if (playerColor == 1) {
        botColor = 2;
    } else if (playerColor == 2) {
        botColor = 1;
    }
    createGrid();
}

function showOpOnnline(){
    document.getElementById("desistionline").style.display = "none";
    document.getElementById("popdesistiuonline").style.display = "none";
    document.getElementById("popganhouonline").style.display = "none";
    document.getElementById("desistir").style.display = "none";
    document.getElementById("popdesistiu").style.display = "none";
    document.getElementById("popganhou").style.display = "none";
    
    document.getElementById("desistionline").style.display = "block";

}