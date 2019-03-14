
//  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗  
// ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝  
// ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗ 
// ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║ 
// ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝ 
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝  

// задаются параметры игры, создаеться экземпляр с игрой
$(window).on( 'page:ready', function(){

	// данные для InputController
	var configInput = {
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
	};

	var configRender = {
		renders: {
			'canvas': {
				renderClass: CanvasRender,
				elementId: '#canvas'
			},
			'directx11': {
				renderClass: DirectX11Render,
				elementId: '#directx11'
			}
		},
		activeRender: 'canvas'
	};

	var params = {
	  // немножко кастамизации
	  blockColor: "rgba(143, 255, 143, 1.)",
	  wallColor: "rgba(68, 119, 68, 1.)" ,
	  areaX: 21,
	  areaY: 15,
	  blockSize: 20,

	  outerColor: "rgba(124, 112, 96, 1)",
	  innerColor: "rgba(204, 177, 156, 1)",
	  startPos: { x: 10, y: 8 },
	  startLength: 3,

	  bonusColor: "rgba(200, 70, 150, 1)",

	  // длительность одного шага игры (в мс)
	  stepTime: 150
	};

	var snakeGame = new Game( configInput, configRender, params );
});