"use strict";
window.onload = function() {
    function disableScroll(event) {
        event.preventDefault();
    }
    document.addEventListener('touchmove', disableScroll, { passive: false });
    document.addEventListener('mousewheel', disableScroll, { passive: false });
}