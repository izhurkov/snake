// 'use strict';

class Game{

	constructor( configInput, configRender, params ){

		// game objects
		this.params = params;
		this.area = new Area( params );
		this.snake = new Snake( params );
		this.bonus = new Bonus( params );
		this.score = 0;
		this.currentVelocity = null;
		this.played = false;

		this.maxSnakeLenght = params.areaX * params.areaY - params.startLength;

		this.stepTime = params.stepTime;

		this.state = {};
		this.gameState = {};

		this.canvas = document.getElementById( "canvas" );
		this.canvas.setAttribute( "width", params.blockSize * (params.areaX + 2) + "px" );
		this.canvas.setAttribute( "height", params.blockSize * (params.areaY + 2) + "px" );
		this.ctx = canvas.getContext( "2d" );

		// input controller
		this.inputController = new InputController( configInput );
		this.inputController.attach( this.canvas );

		// renderer
		this.renderer = new Renderer( configRender, params );

		// 
		this.addListeners();

		// launch game
	  this.startGame();
	  this.menuState();
	};

	addListeners(){
		let scope = this;

	  // events from InpuController
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

	  // events from page
	  ////////////////////
	  $( document ).on( 'game:start', function(e) {
			scope.renderer.isEnable = true;
	    scope.startGameState();
	  });

	  $( document ).on( 'game:pause', function(e) {
	    scope.pauseState();
	  });

	  $( document ).on( 'game:menu', function(e) {
	    scope.menuState();
	  });

	  // events from modalWindow
	  $( document ).on( 'game:playing', function(e) {
	    scope.playingState();
	  });
	};



	// >>> GAME STATE >>>
	// state machine please
	menuState(){
		this.resetGame();
		this.played = false;
	};

	startGameState(){
		this.resetGame();
		this.played = true;
	};

	playingState(){
		this.played = true;
	};

	pauseState(){
		this.played = false;
	};

	loseState(){
		this.updateCounter( ".scoreCounter" );
		$(document).trigger( 'show-screen', 'endScreen' );
		this.played = false;
	};
	// <<< GAME STATE <<<



	startGame(){
		this.mainStep();
	};

	resetGame(){
		this.snake.reset();
		this.bonus.position = this.getNewBonusPosition();

		this.score = 0;
		this.currentVelocity = null;
		this.updateCounter( ".scoreCounter" );
	};



	// >>> GAME LOOPS >>>
	mainStep(){
	  let scope = this;
		setTimeout( function(){
			requestAnimationFrame( () => { scope.mainStep() } );
			scope.gameStep();
		}, this.stepTime );
	};

	gameStep(){
		this.updateGame();
		this.renderer.drawFrame( this.gameState );
		// this.drawGame();
		// this.renderer.drawFrame( this.state );
	};

	updateGame(){
		if (!this.played) return;

		if ( Vector.equals( this.snake.head, this.bonus.position ) ){ // поедание бонуса

			this.score++;
			this.updateCounter( ".scoreCounter" );

			this.maxSnakeLenght--;
			if ( this.maxSnakeLenght <= 0 ){
				this.loseState();
				return;
			}

			this.snake.addBlock( this.currentVelocity );
			this.bonus.position = this.getNewBonusPosition();

		}
		else if ( this.wallCollision() || this.snakeCollision()){ // столкновение со стеной или с собой
			this.loseState();
		}
		else{
			this.snake.update( this.currentVelocity ); // просто движение
		}
		this.gameState = { snake: this.snake.cellPositions, bonus: this.bonus.position };
	};
	// <<< GAME LOOPS <<<


 //////////////// в интерфейс
	updateCounter( id ){
		$(id).html(this.score * 10);
	};

	getNewBonusPosition(){
		var newPos = new Vector( randomInteger( 1, this.params.areaX ), randomInteger( 1, this.params.areaY ) );
		for ( var cellPositions in this.snake.cellPositions )
			if ( Vector.equals( newPos, this.snake.cellPositions[cellPositions] ) ) return this.getNewBonusPosition();
		return newPos;
	};

	wallCollision(){
		if (this.area.blocks[this.snake.head.x][this.snake.head.y] != 0)
			return true;
		return false;
	};

	snakeCollision(){
		for ( var i = 1; i < this.snake.cellPositions.length; i++ ){
			if ( Vector.equals( this.snake.cellPositions[i], this.snake.head ) )
				return true;
		}
		return false;
	};

};
