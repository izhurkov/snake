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

  var buttons = [];
	buttons.push( { text: "continue" } );
	buttons.push( { text: "menu" } );

	var modalWindow = new ModalWindow( "pause", ["continue", "menu"] );

	$( '.startButton' ).click(function(e) {
    $(document).trigger( 'page:start-btn-clicked' );
	  screenManager.showOneScreen('gameScreen');
  });

  $( '#pause' ).click(function(e) {
    $(document).trigger( 'page:pause-btn-clicked' );
		modalWindow.show();
  });

  $( '#menu' ).click(function(e) {
    $(document).trigger( 'page:menu-btn-clicked' );
	  screenManager.showOneScreen('startScreen');
  });

  $( document ).on( 'game:end', function(e) {
	  screenManager.showOneScreen('endScreen');
  });

})();

