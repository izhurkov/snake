'use strict';

class Game{

	constructor( config ){
		// input controller

		// game objects
		this.area = new Area( config );
		this.snake = new Snake( config );
		this.bonus = new Bonus( config );
		this.score = 0;
		this.currentVelocity = null;

		// renderer
		this.canvas = document.getElementById( "canvas" );
		this.canvas.setAttribute( "width", config.blockSize * (config.areaX + 2) + "px" );
		this.canvas.setAttribute( "height", config.blockSize * (config.areaY + 2) + "px" );
		this.ctx = canvas.getContext( "2d" );


		this.inputController = new InputController( config );

    console.log(this.inputController);
		this.inputController.attach( canvas );
		$('#canvas').focus();

		// for requestAnimationFrame
		this.myReq;

		$( document ).on( this.inputController.ACTION_ACTIVATED, function(e, param) {
	    switch( param.detail ){
	    		case 'right':
	        case 'left':
	        case 'up':
	        case 'down':
						currentVelocity = param.detail;
	          break;
	    };
	  });

	  var scope = this;

	  $( document ).on( 'page:start-game', function(e) {
	    scope.startGame();
	  });

	  $( document ).on( 'page:pause-game', function(e) {
	    scope.pauseGame();
	  });
	};

	startGame(){
		requestAnimationFrame( this.mainStep() );
	};

	pauseGame(){
		// cancelAnimationFrame( this.myReq );
	};

	mainStep(){
		setTimeout( function(){
			requestAnimationFrame( this.mainStep() );
			this.gameStep();
		}, 0 );
	};

	gameStep(){
		this.updateGame();
		this.drawGame();
	};

	updateGame(){
		if ( Vector.equals( this.snake.head, this.bonus.pos ) ){
			this.bonus.update( getNewBonusPosition() );
			this.snake.addBlock( this.currentVelocity );
			this.score++;
			this.updateCounter( "gameCounter" );
		} else if ( wallCollision() || snakeCollision()){
			this.updateCounter( "finalCounter" );
			
		} else
			this.snake.update( currentVelocity );
	};

	updateCounter( id ){
		var counter = document.getElementById(id);
		counter.innerHTML = score * 10;
	};

	getNewBonusPosition(){
		var newPos = new Vector( randomInteger( 1, config.areaX ), randomInteger( 1, config.areaY ) );
		for ( var pos in snake.pos )
			if ( Vector.equals( newPos, snake.pos[pos] ) ) return getNewBonusPosition();
		return newPos;
	};

	wallCollision(){
		if (area.blocks[snake.head.x][snake.head.y] != 0)
			return true;
		return false;
	};

	snakeCollision(){
		for ( var i = 1; i < snake.pos.length; i++ ){
			if ( Vector.equals( snake.pos[i], snake.head ) )
				return true;
		}
		return false;
	};

	drawGame(){
		this.area.draw( ctx );
		this.snake.draw( ctx );
		this.bonus.draw( ctx );
	};
}


	// >>> MODAL WINDOW >>>
	// var buttons = [];
	// buttons.push( { text: "continue" } );
	// buttons.push( { text: "menu" } );

	// var modalWindow1 = new modalWindow( "pause", ["continue", "menu"] );
	// $( document ).on( "deactiveAllActions", function(e) {
 //    modalWindow1.show();
 //  });
	// modalWindow1.show();
	// <<< MODAL WINDOW <<<

		// renderer