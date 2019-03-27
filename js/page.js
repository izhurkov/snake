'use strict';

(function() { 

	var screens = {
	  'menuScreen': {
	    onShow: function(){ 
	  		$(document).trigger( 'hide-modal' ); },
	    afterShow: function(){ },
	    onHide: function(){ }
	  },
	  'gameScreen': {

	    onShow: function(){ 
	    	$(document).trigger( 'game:ready' );
	  		$(document).trigger( 'hide-modal' ); },

	    afterShow: function(){
	    	$(document).trigger( 'game:start' ); },

	    onHide: function(){  },
	    afterHide: function(){
	    	$(document).trigger( 'game:ready' ); },

	    'showAnimation': 'fadeIn',
	    'showDuration': 300,
	    'hideAnimation': 'fadeOut',
	    'hideDuration': 1000
	  },
	  'endScreen': {
	    onShow: function(){
	    	// $(document).trigger( 'game:ready' );
	  		$(document).trigger( 'hide-modal' ); },
	  		
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
	  			}
	  		},
	  		'menu': {
	  			value: "menu",
	  			// data-event: 'game:menu;show-screen>menuScreen;hide-modal>pauseModal',
	  			//////////////////////// data-event: 'game:menu;show-screen>menuScreen;hide-modal>pauseModal'
	  			onClick: function(){
  					$(document).trigger( 'show-screen', 'menuScreen' );
	  				$(document).trigger( 'hide-modal', 'pauseModal' );
	  			}
	  		}
		  },
		  onShow: function(){
		  	$(document).trigger( 'game:pause' ); },

	    onHide: function(){ },
	    afterHide: function() {
	    },
	    'showDuration': 500,
	    'hideDuration': 500
		}
	};

	// sound control
	$("#muted").on('click', function() {
    var muted = PIXI.sound.toggleMuteAll();
    $('canvas').focus();
    $("#muted").attr( { 'value': muted ? "unmute" : "mute" } );
	});

	PIXI.utils.sayHello("Hello world!");
	
	new ProgressBar();

	new ScreenManager( screens, modals );

	var manifest = [
		  {src:"assets/Ground.png", id:"ground"},
		  {src:"assets/Wall.png", id:"wall"},
		  {src:"assets/snake-graphics.png", id:"snake-graphics"},
		  {src:"assets/CartoonSmoke.png", id:"cartoonSmoke"},
		  {src:"assets/Bubbles.png", id:"bubbles"},

		  {src:"assets/bonus.mp3", id:"bonus_mp3"},
		  {src:"assets/game over.mp3", id:"game_over_mp3"},
		  {src:"assets/music.mp3", id:"music_mp3"}
		];

	new Preloader( manifest );
})();

