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
	  			//////////////////////// 'game:menu;show-screen>menuScreen;hide-modal>pauseModal'
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

	var manifest = [
		  {src:"assets/Ground.png", id:"ground"},
		  {src:"assets/Wall.png", id:"wall"},
		  {src:"assets/snake-graphics.png", id:"snake-graphics"},
		  {src:"assets/bonus.mp3", id:"bonus_mp3"},
		  {src:"assets/game over.mp3", id:"game_over_mp3"},
		  {src:"assets/music.mp3", id:"music_mp3"}
		];

	PIXI.utils.sayHello("Hello world!");
	
	new ProgressBar();

	new ScreenManager( screens, modals );

	new Preloader( manifest );

})();

