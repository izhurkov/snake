'use strict';

$(window).on( 'page:ready', function(){

	var config = {
		input: {
			devices:{
		    keyboard: {
		      enabled: true
		    }
		  },
		  actions: {
		    'right': {
		      keyCodes:[39]
		    },
		    'left': {
		      keyCodes:[37]
		    },
		    'up': {
		      keyCodes:[38]
		    },
		    'down': {
		      keyCodes:[40]
		    }
		  }
		},
		render: {
			renders: {
				'canvas': {
					elementId: '#canvas'
				}
			},
			activeRender: 'canvas'
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

	  stepTime: 200
	};

	var snakeGame = new Game( config, params );
});