'use strict';

(function() { 

	var screens = {
	  'menuScreen': {
	    onShow: function(){ },
	    onHide: function(){ }
	  },
	  'gameScreen': {
	    onShow: function(){
	    	$(document).trigger( 'game:start' ); },
	    afterShow: function(){
	    	$('canvas:first').focus(); },
	    onHide: function(){ },

	    'showAnimation': 'fadeIn',
	    'showDuration': 400,
	    'hideAnimation': 'fadeOut',
	    'hideDuration': 1000
	  },
	  'endScreen': {
	    onShow: function(){ },
	    onHide: function(){ }
	  }
	};

	var modals = {
	  'pauseModal': {
	  	text: 'Pause',
	  	buttons: {
	  		'continue': {
	  			value: "continue",
	  			onClick: function(){
	  				$(document).trigger( 'game:playing' );
	  				$(document).trigger( 'hide-modal', 'pauseModal' );
	    			$('canvas:first').focus();
	  			}
	  		},
	  		'showTest': {
	  			value: "show second modal window",
	  			onClick: function(){
	  				$(document).trigger( 'show-modal', 'testModal' );
	  			}
	  		},
	  		'menu': {
	  			value: "menu",
	  			onClick: function(){
	  				$(document).trigger( 'game:menu' );
  					$(document).trigger( 'show-screen', 'menuScreen' );
	  				$(document).trigger( 'hide-modal', 'pauseModal' );
	  			}
	  		}
		  },
		  onShow: function(){ $(document).trigger( 'game:pause' ); },
	    onHide: function(){ },
	    'showDuration': 500,
	    'hideDuration': 150
		},
		'testModal': {
	  	text: 'Pause',
	  	buttons: {
	  		'close': {
	  			value: "close all",
	  			// data_event: "game:playing;hide-modal>pauseModal;hide-modal>testModal",
	  			onClick: function(){
	  				$(document).trigger( 'game:playing' );
	  				$(document).trigger( 'hide-modal', 'pauseModal' );
	  				$(document).trigger( 'hide-modal', 'testModal' );
	    			$('canvas:first').focus();
	  			}
	  		}
		  },
		  onShow: function() { 
	    },
	    onHide: function() {
	    },
	    'showDuration': 300,
	    'hideDuration': 150
		}
	};

	 let type = "WebGL"
    if(!PIXI.utils.isWebGLSupported()){
      type = "canvas"
    }

    PIXI.utils.sayHello(type)

	new ScreenManager( screens, modals );

  $(document).trigger( 'show-screen', 'menuScreen' );

  $(document).trigger( 'page:ready' );

})();

