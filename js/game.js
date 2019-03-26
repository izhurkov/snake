'use strict';

class Game{

	constructor( config, params, preloader ){

		// настройка параметров
		this.params = params ? Object.assign({},params) : {};
		this.params.areaX = this.areaX = params.areaX !== undefined ? params.areaX : 50;
		this.params.areaY = this.areaY = params.areaY !== undefined ? params.areaY : 5;
		this.params.stepTime = this.stepTime = params.stepTime !== undefined ? params.stepTime : 1000;
		this.maxSnakeLength = this.params.areaX * this.params.areaY - this.params.startLength;

		this.assetManager = new AssetManager();
		this.assetManager.addEntity();

		this.area = new Area( this.params );
		this.snake = new Snake( this.params );
		this.bonus = new Bonus( this.params );

		this.score = 0;
		this.currentDirection = null;

		this.gameState = {
			area: this.area.blocks
		};

		// отрисовка
		this.renderer = new Renderer( config.render, this.params, preloader, this.gameState );
		this.blockSize = this.renderer.getBlockSize();

		// музыка
		this.soundManager = new SoundManager( config.audio, preloader );

		// управление
		this.inputController = new InputController( config.input );
		this.inputController.attach( this.renderer.getActiveElement() );

		//
		this.interfaceController = new InterfaceController();

		this.STATE_LOADING = 'STATE_LOADING';
		this.STATE_PLAYING = 'STATE_PLAYING';
		this.STATE_FINISHED = 'STATE_FINISHED';
		this.STATE_PAUSE = 'STATE_PAUSE';

		var scope = this;

		var states = {
			'STATE_LOADING': {
				states: [ undefined ],
				onSet: function(){
					scope.resetGame();
				}
			},
			'STATE_PLAYING': {
				states: [ 'STATE_LOADING', 'STATE_LOSED', 'STATE_PAUSE' ],
				onSet: function(){ 
					scope.resetGame();
					scope.playSound('music_mp3')
				}
			},
			'STATE_PAUSE': {
				states: [ 'STATE_PLAYING' ],
				onSet: function(){ }
			},
			'STATE_LOSED': {
				states: [ 'STATE_PLAYING' ],
				onSet: function(){

					$(document).trigger( 'show-screen', 'endScreen' );
					$(document).trigger( 'game:lose', { x: scope.snake.head.x * scope.blockSize + scope.blockSize / 2,
																							y: scope.snake.head.y * scope.blockSize + scope.blockSize / 2 } );
				},
				onDisable: function(){

					scope.resetGame();
				}
			}
		}

		this.stateMachine = new StateMachine( states );
		this.stateMachine.setState( 'STATE_LOADING' );

		this.addListeners();
	  this.startGame();
	};

	addListeners(){
		var scope = this;

		$( document ).on( scope.inputController.ACTION_ACTIVATED, function(e, param) {
	    switch( param.detail.action_name ){
	    		case 'right':
	        case 'left':
	        case 'up':
	        case 'down':
						scope.currentDirection = param.detail.action_name;
	          break;
	        case 'touchup':
	        	scope.setDirectionFromTouch( param.detail.cursor_pos );
	        	break;
	    };
	  });

	  ////////////////////
	  $( document )
	  .on( 'game:start', function(e) {
			scope.setState( 'STATE_PLAYING' );
	  })
	  .on( 'game:pause', function(e) {
			scope.setState( 'STATE_PAUSE' )
	  })
	 	.on( 'game:menu', function(e) {
			scope.setState( 'STATE_LOADING' )
	  })
	  .on( "game:lose", function(e){
			scope.playSound('game_over_mp3');
		})
		.on( "game:bonusUp", function(e){
			scope.playSound('bonus_mp3')
		})
	};



	startGame(){
		this.mainStep();
	};

	resetGame(){
		this.snake.reset();
		this.bonus.position = this.getNewBonusPosition();

		this.score = 0;
		this.currentDirection = null;
	};

	setState( state ){
		this.stateMachine.setState( state );
	};

	getState(){
		return this.stateMachine.getState();
	}

	isState( state ){
		return this.stateMachine.isState( state );
	};

	playSound( sound ){
		this.soundManager.playSound( sound );
	}


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
			snake: this.snake.cellPositions,
			head: this.snake.cellDirections,
			bonus: this.bonus.position
		};

		this.renderer.drawFrame( this.gameState );

		this.interfaceController.update( this.score );
	};

	updateGame(){

		if ( !this.isState( this.STATE_PLAYING ) )
			return;
		// move snake
		this.snake.update( this.currentDirection );

		// meeting with bonus
		if ( Vector.equals( this.snake.head, this.bonus.position ) ){

			this.score++;

			this.maxSnakeLength--;
			if ( this.maxSnakeLength <= 0 ){
				this.setState( 'STATE_LOSED' );
				return;
			}

			this.snake.addBlock( this.currentDirection );
			this.bonus.position = this.getNewBonusPosition();

			$(document).trigger( 'game:bonusUp', { x: this.snake.head.x * this.blockSize + this.blockSize / 2,
																					y: this.snake.head.y * this.blockSize + this.blockSize / 2 } );

		} // meeting with body
		else if ( this.snakeCollision() ){
			this.setState( 'STATE_LOSED' );
		} // meeting with wall blocks
		else if ( this.wallCollision() ){
			this.setState( 'STATE_LOSED' );
		}
	};
	// <<< GAME LOOPS <<<
	


	// >>> GAME LOGIC >>>
	setDirectionFromTouch( cursor_pos ){
		if ( !cursor_pos ) return;
		var cursor = new Vector( Math.floor( cursor_pos.x  / this.blockSize ),
															Math.floor( cursor_pos.y / this.blockSize ) );
		if ( !cursor ) return;

		var snakeMovement = {  x:(cursor.x-this.snake.head.x),
                        y: (cursor.y-this.snake.head.y) };

    var absSnakeMovementX = Math.abs(snakeMovement.x);
    var absSnakeMovementY = Math.abs(snakeMovement.y);

    if ( absSnakeMovementX > absSnakeMovementY ) {
      if (snakeMovement.x < 0) this.currentDirection = 'left';
      else this.currentDirection = 'right';
    } 
    else {
      if (snakeMovement.y < 0) this.currentDirection = 'up';
      else this.currentDirection = 'down';
    }
	};

	getNewBonusPosition(){
		var newPos = new Vector( randomInteger( 1, this.areaX ), randomInteger( 1, this.areaY ) );
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
	// <<< GAME LOGIC <<<

};
