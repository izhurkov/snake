'use strict';

document.addEventListener( "DOMContentLoaded", function() {

	// canvas
	var config = {
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
    },

		blockColor: "rgba(144, 255, 144, 1)",
		wallColor: "rgba(72, 127, 72, 1)"	,
		areaX: 25,
		areaY: 15,
		blockSize: 20,

		outerColor: "rgba(124, 112, 96, 1)",
		innerColor: "rgba(204, 177, 156, 1)",
		startPos: { x: 10, y: 8 },
		startLength: 3,

		bonusColor: "rgba(200, 70, 150, 1)"
	};

	var canvas = document.getElementById( "canvas" );
	canvas.setAttribute( "width", config.blockSize * (config.areaX + 2) + "px" );
	canvas.setAttribute( "height", config.blockSize * (config.areaY + 2) + "px" );
	var ctx = canvas.getContext( "2d" );

	var area = new Area( config );
	var player = new Player( config );
	var bonus = new Bonus( config );
	var score = 0;

	var currentVelocity = null;

	var inputController = new InputController( config ); 
	inputController.attach( canvas );
	inputController.attach( canvas );

	$( document ).on( inputController.ACTION_ACTIVATED, function(e, param) {
    switch( param.detail ){
    		case 'right':
        case 'left':
        case 'up':
        case 'down':
					currentVelocity = param.detail;
          break;
    };
  });

	function gameStart(){
		requestAnimationFrame( mainStep );
	};

	function mainStep(){
		setTimeout( function(){
			requestAnimationFrame( mainStep );
			gameStep();
		}, 500 );
	};

	function gameStep(  ){
		updateGame();
		drawGame();
	};

	function updateGame(){
		if ( Vector.equals( player.head, bonus.pos ) ){
			bonus.update( getNewBonusPosition() );
			player.addBlock();
			score++;
		}
		else if ( wallCollision() ){
			console.log("lose wall");
		}
		else if ( snakeCollision() ){
			console.log("lose snake");
		}
		else
			player.update( currentVelocity );
	};

	function getNewBonusPosition(){
		var newPos = new Vector( randomInteger( 1, config.areaX ), randomInteger( 1, config.areaY ) );
		for ( var pos in player.pos )
			if ( Vector.equals( newPos, player.pos[pos] ) ) return getNewBonusPosition();
		return newPos;
	};

	function wallCollision(){
		if (area.blocks[player.head.x][player.head.y] != 0)
			return true;
		return false;
	};

	function snakeCollision(){
		for ( var i = 1; i < player.pos.length; i++ ){
			if ( Vector.equals( player.pos[i], player.head ) )
				return true;
		}
		return false;
	};


	function drawGame(){
		area.draw( ctx );
		player.draw( ctx );
		bonus.draw( ctx );
	};

	modalWindow.show( "hello" );

	gameStart();
});
