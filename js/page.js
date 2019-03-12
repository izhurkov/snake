'use strict';

(function() {
	$(document).trigger( 'page:ready' );
	
	var screens = {
	  'startScreen': {
	    visible: true
	  },
	  'gameScreen': {
	    visible: false
	  },
	  'endScreen': {
	    visible: false
	  }
	};

	var screenManager = new ScreenManager( screens );

	$( '#start' ).click(function(e) {
    $(document).trigger( 'page:start-game' );
  });

})();

