
//  ██████╗ ██████╗ ███╗   ██╗███████╗██╗ ██████╗  
// ██╔════╝██╔═══██╗████╗  ██║██╔════╝██║██╔════╝  
// ██║     ██║   ██║██╔██╗ ██║█████╗  ██║██║  ███╗ 
// ██║     ██║   ██║██║╚██╗██║██╔══╝  ██║██║   ██║ 
// ╚██████╗╚██████╔╝██║ ╚████║██║     ██║╚██████╔╝ 
//  ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝     ╚═╝ ╚═════╝  

// задаются параметры игры, создаеться экземпляр с игрой
$(window).on( 'page:ready', function(){

	// данные для InputController
	var inputConfig = {
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
	}

	var params = {
	  // немножко кастамизации
	  blockColor: "rgba(144, 255, 144, 1)",
	  wallColor: "rgba(72, 127, 72, 1)" ,
	  areaX: 25,
	  areaY: 15,
	  blockSize: 20,

	  outerColor: "rgba(124, 112, 96, 1)",
	  innerColor: "rgba(204, 177, 156, 1)",
	  startPos: { x: 10, y: 8 },
	  startLength: 3,

	  bonusColor: "rgba(200, 70, 150, 1)",

	  // длительность одного шага игры (в мс)
	  stepTime: 200
	};

	var snakeGame = new Game( inputConfig, params );
});