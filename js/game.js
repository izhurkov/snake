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
		
		this.timerAccel = new Timer( 'timer:accel' );

		this.area = new Area( this.params );
		this.snake = new Snake( this.params );
		this.bonus = new Bonus( this.params );


		this.apple = new Apple( this.params );
		this.rock = new Rock( this.params );
		this.accelerator = new Accelerator( this.params );
		this.frog = new Frog( this.params );

		this.score = 0;
		this.currentDirection = null;

		this.gameState = {
			area: this.area.blocks,
			snake: this.snake.cellPositions,
			direction: this.snake.cellDirections,
			bonus: this.bonus.position,
			apple: this.apple.position,
			rock: this.rock.position,
			accelerator: this.accelerator.position,
			frog: this.frog.position
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
		this.STATE_FPV_PLAYING = 'STATE_FPV_PLAYING';
		this.STATE_FINISHED = 'STATE_FINISHED';
		this.STATE_PAUSE = 'STATE_PAUSE';


		var states = {

			'STATE_READY': {
				states: [ scope.STATE_FINISHED, scope.STATE_PAUSE, scope.STATE_PLAYING, scope.STATE_FPV_PLAYING, undefined ],
				onSet: function(){
					scope.resetGame();
				}
			},

			'STATE_PLAYING': {
				states: [ scope.STATE_READY, scope.STATE_PAUSE, scope.STATE_FPV_PLAYING ],
				onSet: function(){ 

        	scope.inputController.enableAction( 'turnLeft', false );
        	scope.inputController.enableAction( 'turnRight', false );

        	scope.inputController.enableAction( 'right', true );
        	scope.inputController.enableAction( 'left', true );
        	scope.inputController.enableAction( 'up', true );
        	scope.inputController.enableAction( 'down', true );
        	scope.inputController.enableAction( 'touchup', true );

        	$( document ).trigger( 'game:setTopView' );
				},

				onDisable: function(){ }
			},

			'STATE_FPV_PLAYING': {
				states: [ scope.STATE_READY, scope.STATE_PAUSE, scope.STATE_PLAYING ],
				onSet: function(){ 

        	scope.inputController.enableAction( 'turnLeft', true );
        	scope.inputController.enableAction( 'turnRight', true );

        	scope.inputController.enableAction( 'right', false );
        	scope.inputController.enableAction( 'left', false );
        	scope.inputController.enableAction( 'up', false );
        	scope.inputController.enableAction( 'down', false );
        	scope.inputController.enableAction( 'touchup', false );
        	$( document ).trigger( 'game:setChaseView' );
				},

				onDisable: function(){ }
			},

			'STATE_PAUSE':{
				states: [ scope.STATE_PLAYING, scope.STATE_FPV_PLAYING ],
				onSet: function(){
					scope.timerAccel.pause();
				},

				onDisable: function(){
					scope.timerAccel.play();
				}
			},

			'STATE_FINISHED': {
				states: [ scope.STATE_PLAYING, scope.STATE_FPV_PLAYING ],
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

	        case 'setChaseView':
	  				scope.setState( scope.STATE_FPV_PLAYING );
	        	break;
	        case 'setTopView':
	  				scope.setState( scope.STATE_PLAYING );
	        	break;

	        case 'turnLeft':
	        	var directions = {
							"up": "left",
							"left": "down",
							"down": "right",
							"right": "up",
							"null": "right"
						}
	        	scope.currentDirection = directions[scope.currentDirection];
	        	break;

	        case 'turnRight':
	        	var directions = {
							"up": "right",
							"left": "up",
							"down": "left",
							"right": "down",
							"null": "right"
						}
	        	scope.currentDirection = directions[scope.currentDirection];
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
	  	scope.timerAccel.stop();
	  	scope.setState( scope.STATE_FINISHED );
	  	$( document ).trigger('show-screen', 'endScreen');
	  } );
	  EventBus.addEvent('game:pause', function(){
	  	scope.setState( scope.STATE_PAUSE );
	  } );
	  EventBus.addEvent('timer:accel:end', function(){
			scope.accelerator.position = scope.getNewPosition();
	  	scope.stepTime = scope.params.stepTime;
	  } );
	};



	startGame(){
		this.mainStep();
		this.inputController.attach( this.renderer.getActiveElement() );
	};

	resetGame(){
		this.snake.reset();
		this.bonus.position = this.getNewPosition();
		this.apple.position = this.getNewPosition();
		this.rock.position = this.getNewPosition();
		this.accelerator.position = this.getNewPosition();
		this.frog.position = this.getNewPosition();

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

		this.gameState.snake = this.snake.cellPositions;
		this.gameState.direction = this.snake.cellDirections;
		this.gameState.bonus = this.bonus.position;
		this.gameState.apple = this.apple.position;
		this.gameState.rock = this.rock.position;
		this.gameState.accelerator = this.accelerator.position;
		this.gameState.frog = this.frog.position

		this.interfaceController.update( this.score );
	};

	updateGame(){

		if ( !this.isState( this.STATE_PLAYING ) && !this.isState( this.STATE_FPV_PLAYING ))
			return;

		if ( Vector.equals( this.snake.head, this.apple.position ) ){

			this.snake.removeBlock();
			this.apple.position = this.getNewPosition();
		}
		else if ( Vector.equals( this.snake.head, this.accelerator.position ) && !this.timerAccel.isActive ){

			this.timerAccel.play( this.accelerator.acceleratorDuration );
			this.stepTime *= 1 / this.accelerator.acceleratorSpeedMultiply;
			this.accelerator.position = new Vector( 0, 0 );
		}

		// move snake
		this.snake.update( this.currentDirection );
		this.frog.jump( this.rock.position );

		if ( Vector.equals( this.snake.head, this.frog.position ) ){
			this.score+=10;
			this.frog.position = this.getNewPosition();
			$(document).trigger( 'game:frogEaten' );
		}

		// meeting with bonus
		if ( Vector.equals( this.snake.head, this.bonus.position ) ){

			this.score++;

			this.maxSnakeLength--;
			if ( this.maxSnakeLength <= 0 ){
				$(document).trigger( 'game:finished', { x: this.snake.head.x, y: this.snake.head.y } );
				return;
			}

			this.snake.addBlock( this.currentDirection );
			this.bonus.position = this.getNewPosition();

			$(document).trigger( 'game:bonusTaken', { x: this.snake.head.x, y: this.snake.head.y } );

		}
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

	getNewPosition(){
		// var newPos = new Vector( this.bonus.position.x+1, this.bonus.position.y );
		var newPos = new Vector( randomInteger( 1, this.areaX ), randomInteger( 1, this.areaY ) );
		for ( var cellPositions in this.snake.cellPositions )
			if ( Vector.equals( newPos, this.snake.cellPositions[cellPositions] ) ) return this.getNewPosition();
		if ( Vector.equals( newPos, this.bonus.position ) || 
				Vector.equals( newPos, this.apple.position )  || 
				Vector.equals( newPos, this.rock.position )) return this.getNewPosition();
		return newPos;
	};

	wallCollision(){
		// console.log( this.snake.head, this.rock.position )
		if (this.area.blocks[this.snake.head.x][this.snake.head.y] != 0 || Vector.equals( this.snake.head, this.rock.position) )
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