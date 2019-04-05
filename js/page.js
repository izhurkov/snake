'use strict';

(function() { 

	var screens = {
	  'menuScreen': {
	    onShow: function(){ 
	    	$(document).trigger( 'game:ready' );
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
	    'hideDuration': 1400
	  },
	  'endScreen': {
	    onShow: function(){
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
  			$(document).trigger( 'game:start' );
	    },
	    'showDuration': 500,
	    'hideDuration': 800
		}
	};

	PIXI.utils.skipHello();
	
	new ProgressBar();

	new ScreenManager( screens, modals );

	var manifest = [
			// images
		  {src:"assets/Ground.png", id:"ground"},
		  {src:"assets/Wall.png", id:"wall"},
		  {src:"assets/snake-graphics.png", id:"snake-graphics"},
		  {src:"assets/CartoonSmoke.png", id:"cartoonSmoke"},
		  {src:"assets/Bubbles.png", id:"bubbles"},

		  // sounds
		  {src:"assets/bonus.mp3", id:"bonus_mp3"},
		  {src:"assets/game over.mp3", id:"game_over_mp3"},
		  {src:"assets/music.mp3", id:"music_mp3"}

		];

	new Preloader( manifest );
	// new MyPreloader( manifest );
})();

