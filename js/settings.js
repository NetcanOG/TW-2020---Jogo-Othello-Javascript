"use strict";
function showbegin(){
    document.getElementById("spage").style.display= "block";
    document.getElementById("loginform").style.display= "none";
    document.getElementById("header").style.display= "none";
    document.getElementById("modebutton").style.display= "none";
    document.getElementById("topnav").style.display= "none";
    document.getElementById("difficulty").style.display= "none";
    document.getElementById("game").style.display= "none";
    document.getElementById("rules").style.display= "none";
}

function showlogin(){
    document.getElementById("spage").style.display= "none";
    document.getElementById("header").style.display= "block";
    document.getElementById("loginform").style.display= "block";
}

function showmode(){
    document.getElementById("loginform").style.display= "none";
    document.getElementById("topnav").style.display= "block";
    document.getElementById("voltarmodo").style.display= "none";
    document.getElementById("voltarregras").style.display= "none";
    document.getElementById("modebutton").style.display= "block";
    document.getElementById("difficulty").style.display= "none";  
    document.getElementById("rules").style.display= "none";
}

function showdif(bot){
    document.getElementById("modebutton").style.display= "none";
    document.getElementById("voltarmodo").style.display= "block";
    document.getElementById("difficulty").style.display= "block";
    vsBot = bot;
}
function showcolor(diff){
    document.getElementById("color").style.display= "block";
    document.getElementById("voltarmodo").style.display= "none";
    document.getElementById("difficulty").style.display= "none";
    botDifficulty = diff;
}

function showregras(){
    document.getElementById("modebutton").style.display= "none";
    document.getElementById("voltarregras").style.display= "block";
    document.getElementById("rules").style.display= "block";
}

function showgame(color){
    document.getElementById("voltarmodo").style.display= "none";
    document.getElementById("voltarregras").style.display= "none";
    document.getElementById("modebutton").style.display= "none";
    document.getElementById("color").style.display= "none";
    document.getElementById("game").style.display= "block";
    playerColor = color;
    if(playerColor == 1){
      botColor = 2;
    } else if(playerColor == 2){
      botColor = 1;
    }
    createGrid();
}