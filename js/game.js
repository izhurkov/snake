'use strict';

class Game{

	constructor( config, params, preloader ){

		// настройка параметров
		this.params = params ? Object.assign({},params) : {};
		this.params.areaX = this.areaX = params.areaX !== undefined ? params.areaX : 50;
		this.params.areaY = this.areaY = params.areaY !== undefined ? params.areaY : 5;
		this.params.stepTime = this.stepTime = params.stepTime !== undefined ? params.stepTime : 1000;
		this.maxSnakeLength = this.params.areaX * this.params.areaY - this.params.startLength;

		// this.assetManager = new AssetManager( this.params);
		// this.assetManager.addEntity( config.assets );
		// this.assetManager.cloneEntity( 'bonus', 3 );

		this.area = new Area( this.params );
		this.snake = new Snake( this.params );
		this.bonus = new Bonus( this.params );

		this.score = 0;
		this.currentDirection = null;

		this.gameState = {
			area: this.area.blocks,
			snake: this.snake.cellPositions,
			direction: this.snake.cellDirections,
			bonus: this.bonus.position
			// snake: this.assetManager.getData( 'snake' ),
			// bonus: this.assetManager.getData( 'bonus' )
		};


		var scope = this;

		// отрисовка
		this.renderer = new Renderer( config.render, this.params, preloader, this.gameState, scope );
		this.blockSize = this.renderer.getBlockSize();

		// музыка
		this.soundManager = new SoundManager( config.audio, preloader );

		// управление
		this.inputController = new InputController( config.input );
		this.inputController.attach( this.renderer.getActiveElement() );

		//
		this.interfaceController = new InterfaceController();

		// 
		this.STATE_READY = 'STATE_READY';
		this.STATE_PLAYING = 'STATE_PLAYING';
		this.STATE_FINISHED = 'STATE_FINISHED';
		this.STATE_PAUSE = 'STATE_PAUSE';


		var states = {

			'STATE_READY': {
				states: [ scope.STATE_FINISHED, scope.STATE_PAUSE, scope.STATE_PLAYING, undefined ],
				onSet: function(){
					scope.resetGame();
				}
			},

			'STATE_PLAYING': {
				states: [ scope.STATE_READY, scope.STATE_PAUSE ],
				onSet: function(){ 
					$( scope.renderer.getActiveElement() ).focus();
					scope.playSound('music_mp3');
				},

				onDisable: function(){ }
			},

			'STATE_PAUSE':{
				states: [ scope.STATE_PLAYING ]
			},

			'STATE_FINISHED': {
				states: [ scope.STATE_PLAYING ],
				onSet: function(){
					scope.playSound('game_over_mp3');
				},
				onDisable: function(){

				}
			}
		}

		this.stateMachine = new StateMachine( states );

		this.even = true;

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

	        case 'setCanvas':
	        	scope.renderer.setActiveRenderer('canvas');
						scope.inputController.attach( scope.renderer.getActiveElement() );
	        	break;

	        case 'setPixi':
	        	scope.renderer.setActiveRenderer('pixi');
						scope.inputController.attach( scope.renderer.getActiveElement() );
	        	break;
	    };
	  });

	  ////////////////////
	  //
	  EventBus.addEvent('game:ready', function(){
	  	scope.setState( scope.STATE_READY );
	  } );
	  EventBus.addEvent('game:start', function(){
	  	scope.setState( scope.STATE_PLAYING );
	  } );
	  EventBus.addEvent('game:finished', function(){
	  	scope.setState( scope.STATE_FINISHED );
	  	$( document ).trigger('show-screen', 'endScreen');
	  } );
	  EventBus.addEvent('game:pause', function(){
	  	scope.setState( scope.STATE_PAUSE );
	  } );
	};



	startGame(){
		this.mainStep();
		this.inputController.attach( this.renderer.getActiveElement() );
	};

	resetGame(){
		this.snake.reset();
		this.bonus.position = this.getNewBonusPosition();

		this.score = 0;
		this.currentDirection = null;
		this.inputController.attach( this.renderer.getActiveElement() );
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
			direction: this.snake.cellDirections,
			bonus: this.bonus.position
		};

		// this.renderer.drawFrame( this.gameState );

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
				$(document).trigger( 'game:finished', { x: this.snake.head.x, y: this.snake.head.y } );
				return;
			}

			this.snake.addBlock( this.currentDirection );
			this.bonus.position = this.getNewBonusPosition();

			$(document).trigger( 'game:bonusTaken', { x: this.snake.head.x, y: this.snake.head.y } );

		} // meeting with body
		else if ( this.snakeCollision() ){
				$(document).trigger( 'game:finished', { x: this.snake.head.x, y: this.snake.head.y } );
		} // meeting with wall blocks
		else if ( this.wallCollision() ){
				$(document).trigger( 'game:finished', { x: this.snake.head.x, y: this.snake.head.y } );
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
		// var newPos = new Vector( this.bonus.position.x+1, this.bonus.position.y );
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


function EventBus(){}

EventBus.addEvent = function( eventName, atEvent ){
	$(document).on( eventName, atEvent )
}