// ==UserScript==
// @name         Next/Forward Page for heise select
// @version      0.1
// @description  Press Left/Right arrow key for previous/next page
// @author       Kuermel
// @match        https://www.heise.de/select/*
// ==/UserScript==

document.onkeydown = checkKey;

function checkKey(e) {

    e = e || window.event;

    if (e.keyCode == '37' || e.keyCode == '65') {
	document.getElementsByClassName("nav__link nav__link--prev")[0].click();
       // left arrow or a
    }
    else if (e.keyCode == '39' || e.keyCode == '68') {
	document.getElementsByClassName("nav__link nav__link--next")[0].click();
       // right arrow or d
    }

}
