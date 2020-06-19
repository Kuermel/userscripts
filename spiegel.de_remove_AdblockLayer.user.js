// ==UserScript==
// @name         spiegel.de Remove AdblockLayer
// @version      0.1
// @author       Kuermel
// @include      https://www.spiegel.de/*
// ==/UserScript==

(function() {
    function remove_lock_layer(){
    'use strict';
        var elements = document.querySelectorAll('[data-component="AdblockLayer"]');
        for (var i = 0; i < elements.length; i++) {
            elements[i].remove();
        };
        (function myLoop(i) {
            setTimeout(function() {
                document.documentElement.classList.remove("overlay-open");
                if (--i) myLoop(i);
            }, 1000)
        })(10);

}
setTimeout(remove_lock_layer, 1000);
}());
