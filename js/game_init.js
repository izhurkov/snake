'use strict';

var count = 0;

$(window).on( 'preloader:complete', function( e, data ){

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
		    }
		  }
		},
		render: {
			renders: {
				'canvas': {
					parentElement: '#renderer-container'
				},
				'three': {
					parentElement: '#renderer-container'
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
	  areaX: 11,
	  areaY: 9,
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