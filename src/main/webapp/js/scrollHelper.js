define(function() {
	"use strict";

	var scrollX = 0, scrollY = 0;

    function saveScroll(){
        if( typeof( window.pageYOffset ) == 'number' ) {
            scrollX = window.pageXOffset;
            scrollY = window.pageYOffset;
        } else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
            scrollX = document.body.scrollLeft;
            scrollY = document.body.scrollTop;
        } else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
            scrollX = document.documentElement.scrollLeft;
            scrollY = document.documentElement.scrollTop;
        }
    }
    function restoreScroll(){
        window.scrollTo(scrollX, scrollY);
    }

    return {
    	save: saveScroll,
		restore: restoreScroll
	};
});
