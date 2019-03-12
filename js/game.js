// 'use strict';

class Game{

	constructor( config ){
		// input controller

		// game objects
		this.config = config;
		this.area = new Area( config );
		this.snake = new Snake( config );
		this.bonus = new Bonus( config );
		this.score = 0;
		this.currentVelocity = null;

		this.played;

		// renderer
		this.canvas = document.getElementById( "canvas" );
		this.canvas.setAttribute( "width", config.blockSize * (config.areaX + 2) + "px" );
		this.canvas.setAttribute( "height", config.blockSize * (config.areaY + 2) + "px" );
		this.ctx = canvas.getContext( "2d" );


		this.inputController = new InputController( config );
		this.inputController.attach( canvas );

		this.myReq;

	  let scope = this;

		$( document ).on( scope.inputController.ACTION_ACTIVATED, function(e, param) {
	    switch( param.detail ){
	    		case 'right':
	        case 'left':
	        case 'up':
	        case 'down':
						scope.currentVelocity = param.detail;
	          break;
	    };
	  });

	  $( document ).on( 'page:start-btn-clicked', function(e) {
			scope.resetGame();
			scope.canvas.focus();
	  });

	  $( document ).on( 'page:pause-btn-clicked', function(e) {
	  	console.log("pause");
	    scope.pauseGame();
	  });
	};

	startGame(){
		this.mainStep();
	};

	resetGame(){
		this.snake.reset( this.config );
		this.score = 0;
		this.currentVelocity = null;
		this.played = true;
	};

	pauseGame(){
	  // 	let scope = this;
		// cancelAnimationFrame( scope.myReq );
	};

	mainStep(){
	  let scope = this;
		setTimeout( function(){
			requestAnimationFrame( () => { scope.mainStep() } );
			scope.gameStep();
		}, 200 );
	};

	gameStep(){
		this.updateGame();
		this.drawGame();
	};

	updateGame(){
		if (!this.played) return;
		if ( Vector.equals( this.snake.head, this.bonus.pos ) ){
			this.bonus.update( this.getNewBonusPosition() );
			this.snake.addBlock( this.currentVelocity );
			this.score++;
			this.updateCounter( "gameCounter" );
		} else if ( this.wallCollision() || this.snakeCollision()){
			this.updateCounter( "finalCounter" );
			$(document).trigger( 'game:end' );
			this.played = false;
		} else{
			this.snake.update( this.currentVelocity );
		}
	};

	updateCounter( id ){
		var counter = document.getElementById(id);
		counter.innerHTML = this.score * 10;
	};

	getNewBonusPosition(){
		var newPos = new Vector( randomInteger( 1, this.config.areaX ), randomInteger( 1, this.config.areaY ) );
		for ( var pos in this.snake.pos )
			if ( Vector.equals( newPos, this.snake.pos[pos] ) ) return this.getNewBonusPosition();
		return newPos;
	};

	wallCollision(){
		if (this.area.blocks[this.snake.head.x][this.snake.head.y] != 0)
			return true;
		return false;
	};

	snakeCollision(){
		for ( var i = 1; i < this.snake.pos.length; i++ ){
			if ( Vector.equals( this.snake.pos[i], this.snake.head ) )
				return true;
		}
		return false;
	};

	drawGame(){
		this.area.draw( this.ctx );
		this.snake.draw( this.ctx );
		this.bonus.draw( this.ctx );
	};
}


	// >>> MODAL WINDOW >>>
	//
	// <<< MODAL WINDOW <<<

		// renderer