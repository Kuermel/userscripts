// ==UserScript==
// @name         sueddeutsche.de Remove Ad
// @version      0.1
// @author       Kuermel
// @include      https://www.sueddeutsche.de/*
// ==/UserScript==

(function() {
    function remove_lock_layer(){
    'use strict';

  document.body.style.overflowY = "visible";
    var elements = document.querySelectorAll("[data-class~=lock-layer]");
        while(elements.length > 0){
             elements[0].parentNode.removeChild(elements[0]);
        }

//setTimeout(remove_lock_layer, 5000);

}
setTimeout(remove_lock_layer, 5000);
// remove_lock_layer();
}());
