// ==UserScript==
// @name         spiegel.de Remove AdblockLayer
// @version      0.1
// @author       Kuermel
// @include      https://www.spiegel.de/*
// ==/UserScript==

(function() {
    function remove_lock_layer(){
    'use strict';
  document.documentElement.classList.remove("overlay-open");
        
    var elements = document.querySelectorAll("[data-component="AdblockLayer"]");
        while(elements.length > 0){
             elements[0].parentNode.removeChild(elements[0]);
        }

//setTimeout(remove_lock_layer, 5000);

}
setTimeout(remove_lock_layer, 5000);
// remove_lock_layer();
}());
