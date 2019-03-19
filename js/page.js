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

	//preloader
	var preloader;
	var manifest;
	var totalLoaded = 0;

 	manifest = [
	  {src:"assets/Ground.png", id:"ground"},
	  {src:"assets/Wall.png", id:"wall"},
	  {src:"assets/snake-graphics.png", id:"snake-graphics"},
	  {src:"assets/bonus.mp3", id:"bonus_mp3"},
	  {src:"assets/game over.mp3", id:"game_over_mp3"},
	  {src:"assets/music.mp3", id:"music_mp3"}
	];

  var queue = new createjs.LoadQueue(true);
  queue.loadManifest(manifest);
  queue.on("complete", handleComplete);
  queue.on("progress", handleProgress);
  queue.on("fileload", handleFileLoad);


	//use event.loaded to get the percentage of the loading
  function handleProgress(event)
	{
	  // console.log("Progress:", event);	
	}
	 
	//triggered when all loading is complete
	function handleComplete(event) {
	  // console.log("Complete:", event);	
	  var soundsrc = queue.getResult("bonus_mp3");
	  const sound = PIXI.sound.Sound.from(soundsrc);
		sound.play();
	 	// document.body.appendChild(image);

	}
	 
	//triggered when an individual file completes loading
	function handleFileLoad(event) {
	
		// console.log(event, PreloadJS.IMAGE);
		switch(event.loader.type)
		{
		  case PreloadJS.IMAGE:
		   	var img = new Image();
		    img.src = event.loader._item.src;
		    $(img).on("load", handleLoadComplete());
		  	break;

		  case PreloadJS.SOUND:
		  	var sound = new Audio();
		    sound.src = event.loader._item.src;
		    $(sound).on("load", handleLoadComplete());
		  	break;
		};

	};

	// console.log(window);

	function handleLoadComplete(event) 
	{
		totalLoaded++;
		console.log("files loaded:", totalLoaded);

		if ( manifest.length === totalLoaded )
			console.log("complete:", totalLoaded);
	}

	PIXI.utils.sayHello("Hello world!")

	new ScreenManager( screens, modals );

  $(document).trigger( 'show-screen', 'menuScreen' );

  $(document).trigger( 'page:ready' );

})();

