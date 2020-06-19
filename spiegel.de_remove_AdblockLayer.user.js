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
        var elements = document.querySelectorAll('[data-component="AdblockLayer"]');
        for (var i = 0; i < elements.length; i++) {
            elements[i].remove();
        };


//setTimeout(remove_lock_layer, 5000);

}
setTimeout(remove_lock_layer, 1000);
// remove_lock_layer();
}());
