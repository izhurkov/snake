'use strict';

(function() { 

	var screens = {
	  'menuScreen': {
	    onShow: function(){ },
	    afterShow: function(){
	    	$(document).trigger( 'game:menu' ); },
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
	  				$(document).trigger( 'hide-modal', 'pauseModal' );
	    			$(document).trigger( 'game:start' );
	    			$('canvas:first').focus();
	  			}
	  		},
	  		'showTest': {
	  			value: "show second modal",
	  			onClick: function(){
	  				$(document).trigger( 'show-modal', 'testModal' );
	  			}
	  		},
	  		'menu': {
	  			value: "menu",
	  			// data-event: 'game:menu;show-screen>menuScreen;hide-modal>pauseModal',
	  			//////////////////////// data-event: 'game:menu;show-screen>menuScreen;hide-modal>pauseModal'
	  			onClick: function(){
	  				$(document).trigger( 'game:menu' );
  					$(document).trigger( 'show-screen', 'menuScreen' );
	  				$(document).trigger( 'hide-modal', 'pauseModal' );
	  			}
	  		}
		  },
		  onShow: function(){ $(document).trigger( 'game:pause' ); },
	    onHide: function(){ },
	    afterHide: function() {
	    },
	    'showDuration': 500,
	    'hideDuration': 500
		},
		'testModal': {
	  	text: 'Pause',
	  	buttons: {
	  		'close': {
	  			value: "close all",
	  			onClick: function(){
	  				$(document).trigger( 'hide-modal', 'pauseModal' );
	  				$(document).trigger( 'hide-modal', 'testModal' );
	    			$(document).trigger( 'game:start' );
	    			$('canvas:first').focus();
	  			}
	  		}
		  },
		  onShow: function() { },
	    onHide: function() { },
	    'showDuration': 300,
	    'hideDuration': 500
		}
	};
	$("#muted").on('click', function() {
    var muted = PIXI.sound.toggleMuteAll();
    $('canvas').focus();
    var tmp = muted ? "unmute" : "mute";
    $("#muted").attr( { 'value': tmp } );
	});

	PIXI.utils.sayHello("Hello world!");
	
	new ProgressBar();

	new ScreenManager( screens, modals );

	var manifest = [
		  {src:"assets/Ground.png", id:"ground"},
		  {src:"assets/Wall.png", id:"wall"},
		  {src:"assets/snake-graphics.png", id:"snake-graphics"},
		  {src:"assets/bonus.mp3", id:"bonus_mp3"},
		  {src:"assets/game over.mp3", id:"game_over_mp3"},
		  {src:"assets/music.mp3", id:"music_mp3"}
		];

	new Preloader( manifest );

})();

