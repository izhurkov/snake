'use strict';

$( document ).on( 'preloader:complete', function( e, data ){

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

	new ScreenManager( screens, modals );

	var config = {
		input: {
			devices:{
		    keyboard: {
		      enabled: true,
		      device_class: KeyboardInputDevice
		    },
		    mouse: {
		    	minSwipeLength: 40,
		      enabled: true,
		      device_class: MouseInputDevice
		    },
		    touchscreen: {
		    	minSwipeLength: 40,
		      enabled: true,
		      device_class: TouchscreenInputDevice
		    }
		  },
		  actions: {
		    'right': {
		      keyCodes:[39],
        	gestures: ['swipe-right']
		    },
		    'left': {
		      keyCodes:[37],
        	gestures: ['swipe-left']
		    },
		    'up': {
		      keyCodes:[38],
        	gestures: ['swipe-up']
		    },
		    'down': {
		      keyCodes:[40],
        	gestures: ['swipe-down']
		    },
		    'setCanvas': {
		      keyCodes:[79],
        	gestures: ['setCanvas']
		    },
		    'setPixi': {
		      keyCodes:[80],
        	gestures: ['setPixi']
		    },
		    'touchup': {
        	gestures: ['touchup']
		    },
		    'turnRight': {
		      keyCodes:[68]
		    },
		    'turnLeft': {
		      keyCodes:[65]
		    },
		    'setChaseView': {
		      keyCodes:[50]
		    },
		    'setTopView': {
		      keyCodes:[49]
		    },

		  }
		},
		render: {
			renders: {
				'canvas': {
					parentElement: '#renderer-container'
				},
				'three': {
					parentElement: '#renderer-container',
					snakeGeometryParams: {
						'snakeBody_top_left': 
						{
							start: { x: 0.5, y: 0 },
							end: { x: 0, y: -0.5 }
						},
						'snakeBody_top_right': 
						{
							start: { x: 0.5, y: 0 },
							end: { x: 1, y: -0.5 }
						},

						'snakeBody_horizontal': 
						{
							start: { x: 0, y: -0.5 },
							end: { x: 1, y: -0.5 }
						},
						'snakeBody_vertical': 
						{
							start: { x: 0.5, y: 0 },
							end: { x: 0.5, y: -1 }
						},

						'snakeBody_bottom_left': 
						{
							start: { x: 0, y: -0.5 },
							end: { x: 0.5, y: -1 }
						},
						'snakeBody_bottom_right': 
						{
							start: { x: 0.5, y: -1 },
							end: { x: 1, y: -0.5 }
			 			},


						'snakeTail_up': 
						{
							rotation: 0
						},
						'snakeTail_right': 
						{
							rotation: 3 * Math.PI / 2
						},
						'snakeTail_down': 
						{
							rotation: Math.PI
						},
						'snakeTail_left': 
						{
							rotation: Math.PI / 2
						}
					}
				},
				'pixi': {
					parentElement: '#renderer-container',
					textures: {
						groundBlock:{
							path: "ground",
						},
						wallBlock:{
							path: "wall",
						},
						snake:{
							path: "snake-graphics",
							sprites: {
								'snakeHead_up': 
								{ "x":192,"y":0,"w":64,"h":64 },
								'snakeHead_right': 
								{ "x":256,"y":0,"w":64,"h":64 },
								'snakeHead_left': 
								{ "x":192,"y":64,"w":64,"h":64 },
								'snakeHead_down': 
								{ "x":256,"y":64,"w":64,"h":64 },


								'snakeBody_top_left': 
								{ "x":128,"y":128,"w":64,"h":64 },
								'snakeBody_top_right': 
								{ "x":0,"y":64,"w":64,"h":64 },

								'snakeBody_horizontal': 
								{ "x":64,"y":0,"w":64,"h":64 },
								'snakeBody_vertical': 
								{ "x":128,"y":64,"w":64,"h":64 },

								'snakeBody_bottom_left': 
								{ "x":128,"y":0,"w":64,"h":64 },
								'snakeBody_bottom_right': 
								{ "x":0,"y":0,"w":64,"h":64 },

								'snakeTail_up': 
								{ "x":192,"y":128,"w":64,"h":64 },
								'snakeTail_right': 
								{ "x":256,"y":128,"w":64,"h":64 },
								'snakeTail_left': 
								{ "x":192,"y":192,"w":64,"h":64 },
								'snakeTail_down': 
								{ "x":256,"y":192,"w":64,"h":64 }
							}
						},
						bonus:{
							path: "snake-graphics",
							sprites: {
								'bonus': 
								{ "x":0,"y":192,"w":64,"h":64 },
							}
						}
					},
					emitters: {
						EMITTER_SMOKE: {"alpha":{"start":0.8,"end":0},"scale":{"start":0.3,"end":0.6,"minimumScaleMultiplier":2},"color":{"start":"#ffe44c","end":"#fc633c"},"speed":{"start":30,"end":0,"minimumSpeedMultiplier":1},"acceleration":{"x":1,"y":1},"maxSpeed":0,"startRotation":{"min":0,"max":360},"noRotation":false,"rotationSpeed":{"min":0,"max":40},"lifetime":{"min":0.8,"max":1.2},"blendMode":"normal","frequency":0.001,"emitterLifetime":0.1,"maxParticles":6,"pos":{"x":100,"y":100},"addAtBack":false,"spawnType":"point"}
						,
						EMITTER_BONUS: {"alpha":{"start":1,"end":0.18},"scale":{"start":0.6,"end":0.2,"minimumScaleMultiplier":1},"color":{"start":"#D13C2C","end":"#FC968B"},"speed":{"start":80,"end":40,"minimumSpeedMultiplier":1},"acceleration":{"x":1,"y":1},"maxSpeed":0,"startRotation":{"min":0,"max":360},"noRotation":false,"rotationSpeed":{"min":0,"max":360},"lifetime":{"min":0.5,"max":0.7},"blendMode":"normal","frequency":0.001,"emitterLifetime":0.1,"maxParticles":20,"pos":{"x":100,"y":100},"addAtBack":false,"spawnType":"point"}
					}
				}
			},
			activeRender: 'three'
		},
		audio: {
			sounds: {
				bonus_mp3: {
					volume: 0.5
				},
				game_over_mp3: {
					volume: 0.6
				},
				music_mp3: {
					volume: 0.3,
					loop: true
				}
			}
		}
	};

	var params = {
		
	  blockColor: "rgba(143, 255, 143, 1)",
	  wallColor: "rgba(68, 119, 68, 1)" ,
	  areaX: 15,
	  areaY: 11,
	  blockSize: 24,

	  headColor: "rgba(124, 112, 96, 1)",
	  bodyColor: "rgba(204, 177, 156, 1)",
	  startPos: { x: 4, y: 2 },
	  startLength: 3,

	  bonusColor: "rgba(200, 70, 150, 1)",

	  stepTime: 500,
	  acceleratorSpeedMultiply: 2,
	  acceleratorDuration: 5
	};

	var snakeGame = new Game( config, params, data.queue );

	$(document).trigger('show-screen', 'menuScreen');

});