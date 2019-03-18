// 'use strict';

class Game{

	constructor( config, params ){

		// game objects
		// if ( params !== undefined )
		// 	this.params = Object.assign({},params);
		// else
		// 	this.params = {};
		this.params = params ? Object.assign({},params) : {};

		// this.blockColor = params.blockColor || true;
		// this.blockColor = params.blockColor !== undefined ? params.blockColor || '#0ff';

	 	this.setDefaultParams();

		this.area = new Area( this.params );
		this.snake = new Snake( this.params );
		this.bonus = new Bonus( this.params );
		this.score = 0;
		this.currentVelocity = null;
		this.isPlaying = false;

		this.maxSnakeLenght = this.params.areaX * this.params.areaY - this.params.startLength;

		this.stepTime = this.params.stepTime;

		this.gameState = {};

		// input controller
		// this.canvas = document.getElementById( "canvas" );
		// this.canvas.setAttribute( "width", this.params.blockSize * (this.params.areaX + 2) + "px" );
		// this.canvas.setAttribute( "height", this.params.blockSize * (this.params.areaY + 2) + "px" );
		// this.ctx = canvas.getContext( "2d" );
		
		this.inputController = new InputController( config.input );
		this.inputController.attach( this.canvas );

		// renderer
		this.renderer = new Renderer( config.render, this.params );

		this.interfaceController = new InterfaceController();

		// 
		this.addListeners();

		// launch game
	  this.startGame();
	  this.menuState();
	};

	setDefaultParams(){
		if ( !this.params.blockColor ) this.params.blockColor = '#0ff';
		if ( !this.params.wallColor ) this.params.wallColor = '#09f';
		if ( !this.params.areaX ) this.params.areaX = 50;
		if ( !this.params.areaY ) this.params.areaY = 5;
		if ( !this.params.blockSize ) this.params.blockSize = 15;

		if ( !this.params.headColor ) this.params.headColor = '#9f0';
		if ( !this.params.bodyColor ) this.params.bodyColor = '#9f0';
		if ( !this.params.startPos ) this.params.startPos = { x: 1, y: 1 };
		if ( !this.params.startLength ) this.params.startLength = 1;

		if ( !this.params.bonusColor ) this.params.bonusColor = '#f90';

		if ( !this.params.stepTime ) this.params.stepTime = 100;
	}

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
		this.isPlaying = false;
	};

	startGameState(){
		this.resetGame();
		this.isPlaying = true;
	};

	playingState(){
		this.isPlaying = true;
	};

	pauseState(){
		this.isPlaying = false;
	};

	loseState(){
		$(document).trigger( 'show-screen', 'endScreen' );
		this.isPlaying = false;
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

		this.gameState = {
			isPlaying: this.isPlaying,
			snake: this.snake.cellPositions,
			bonus: this.bonus.position
		};

		this.renderer.drawFrame( this.gameState );

		this.interfaceController.update( this.score );
	};

	updateGame(){

		if (!this.isPlaying) return;

		if ( Vector.equals( this.snake.head, this.bonus.position ) ){

			this.score++;

			this.maxSnakeLenght--;
			if ( this.maxSnakeLenght <= 0 ){
				this.loseState();
				return;
			}

			this.snake.addBlock( this.currentVelocity );
			this.bonus.position = this.getNewBonusPosition();

		}
		else if ( this.snakeCollision() ){
			this.loseState();
		}
		else if ( this.wallCollision() ){
			this.snake.bounceWall();
			this.loseState();
		}
		else{
			this.snake.update( this.currentVelocity );
		}
	};
	// <<< GAME LOOPS <<<

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
