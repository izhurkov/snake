'use strict';

$(window).on( 'page:ready', function(){

	var config = {
		input: {
			devices:{
		    keyboard: {
		      enabled: true
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
				'canvas': {
					elementId: '#canvas'
				},
				'pixi': {
					appendToElement: '#renderer-container'
				}
			},
			activeRender: 'pixi'
		}
	};

	var params = {
		
	  blockColor: "rgba(143, 255, 143, 1)",
	  wallColor: "rgba(68, 119, 68, 1)" ,
	  areaX: 21,
	  areaY: 15,
	  blockSize: 20,

	  headColor: "rgba(124, 112, 96, 1)",
	  bodyColor: "rgba(204, 177, 156, 1)",
	  startPos: { x: 10, y: 8 },
	  startLength: 3,

	  bonusColor: "rgba(200, 70, 150, 1)",

	  stepTime: 300
	};

	var snakeGame = new Game( config, params );
});