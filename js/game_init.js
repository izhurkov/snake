'use strict';

var count = 0;

$(window).on( 'preloader:complete', function( e, data ){

	$(document).trigger('show-screen', 'menuScreen');

	var config = {
		input: {
			devices:{
		    keyboard: {
		      enabled: true,
		      device_class: KeyboardInputDevice
		    },
		    mouse: {
		      enabled: true,
		      device_class: MouseInputDevice
		    },
		    touchscreen: {
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
		    'touchup': {
        	gestures: ['touchup']
		    }
		  }
		},
		render: {
			renders: {
				'canvas': { },
				'pixi': {
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
					}
				}
			},
			activeRender: 'pixi',
			parentElement: '#renderer-container'
		}
	};

	var params = {
		
	  blockColor: "rgba(143, 255, 143, 1)",
	  wallColor: "rgba(68, 119, 68, 1)" ,
	  areaX: 15,
	  areaY: 11,
	  blockSize: 20,

	  headColor: "rgba(124, 112, 96, 1)",
	  bodyColor: "rgba(204, 177, 156, 1)",
	  startPos: { x: 5, y: 6 },
	  startLength: 3,

	  bonusColor: "rgba(200, 70, 150, 1)",

	  stepTime: 200
	};

	var snakeGame = new Game( config, params, data.queue );

});