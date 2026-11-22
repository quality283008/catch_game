"use strict"
$(window).on('load',function(){
    const CountText = document.getElementById("count_text");
    CountText.innerHTML = "3";
    setTimeout(function(){
        CountText.innerHTML = "2";
    },1000);
    setTimeout(function(){
        CountText.innerHTML = "1";
    },2000);
    setTimeout(function(){
        window.location.href = "game.html";
    },3000);
});