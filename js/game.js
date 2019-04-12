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
		this.currentTurn = null;

		this.gameState = {
			area: this.area.blocks,
			snake: this.snake.cellPositions,
			direction: this.snake.cellDirections,
			bonus: this.bonus.position,
			apple: this.apple.position,
			rock: this.rock.position,
			accelerator: this.accelerator.position,
			frog: this.frog.position,

			_snake: this.snake._cellPositions,
			_direction: this.snake._cellDirections
		};

		this.DEV_PAUSE = false;

		this.chaseView = false;


		var scope = this;

		

		// управление
		this.inputController = new InputController( config.input );

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
				},
				onDisable: function(){ }
			},

			'STATE_PAUSE':{
				states: [ scope.STATE_PLAYING ],
				onSet: function(){
					scope.timerAccel.pause();
				},

				onDisable: function(){
					scope.timerAccel.continue();
				}
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
		// отрисовка
		this.renderer = new Renderer( config.render, this.params, preloader, this.gameState, scope );
		this.blockSize = this.renderer.getBlockSize();

		// музыка
		this.soundManager = new SoundManager( config.audio, preloader );

		this.even = true;

		this.addListeners();
	  this.startGame();

		this.inputController.enableAction( 'turnLeft', false );
  	this.inputController.enableAction( 'turnRight', false );
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
	  				scope.inputController.enableAction( 'turnLeft', true );
	        	scope.inputController.enableAction( 'turnRight', true );

	        	scope.inputController.enableAction( 'right', false );
	        	scope.inputController.enableAction( 'left', false );
	        	scope.inputController.enableAction( 'up', false );
	        	scope.inputController.enableAction( 'down', false );
	        	scope.inputController.enableAction( 'touchup', false );
	        	$( document ).trigger( 'game:setChaseView' );
	        	scope.currentDirection = null;
	        	scope.chaseView = true;
	        	break;
	        case 'setTopView':
	  				scope.inputController.enableAction( 'turnLeft', false );
	        	scope.inputController.enableAction( 'turnRight', false );

	        	scope.inputController.enableAction( 'right', true );
	        	scope.inputController.enableAction( 'left', true );
	        	scope.inputController.enableAction( 'up', true );
	        	scope.inputController.enableAction( 'down', true );
	        	scope.inputController.enableAction( 'touchup', true );

	        	$( document ).trigger( 'game:setTopView' );
	        	scope.currentTurn = null;
	        	scope.chaseView = false;
	        	break;

	        case 'turnLeft':
	        	var directions = {
							"up": "left",
							"left": "down",
							"down": "right",
							"right": "up",
							"null": "up"
						}
	        	scope.currentTurn = directions[scope.currentDirection];
	        	break;

	        case 'turnRight':
	        	var directions = {
							"up": "right",
							"left": "up",
							"down": "left",
							"right": "down",
							"null": "down"
						}
	        	scope.currentTurn = directions[scope.currentDirection];
	        	break;
	    };
	  });

	  ////////////////////
	  
	  $( document )
	  .on( 'game:ready', function(e) {
			scope.setState( scope.STATE_READY )
	  })
	  .on( 'game:start', function(e) {
			scope.setState( scope.STATE_PLAYING );
	  })
	  .on( "game:finished", function(e){
			scope.timerAccel.stop();
	  	scope.setState( scope.STATE_FINISHED );
	  	$( document ).trigger('show-screen', 'endScreen');
		})
		.on( "game:pause", function(e){
			scope.setState( scope.STATE_PAUSE );
		})
	 	.on( "timer:accel:end", function(e){
			scope.accelerator.position = scope.getNewPosition();
	  	scope.stepTime = scope.params.stepTime;
		})
	};



	startGame(){
		this.mainStep();
		this.frogStep();
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
		this.currentTurn = null;
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

	frogStep(){
	  let scope = this;
		setTimeout( function(){
			requestAnimationFrame( () => { scope.frogStep() } );
				// console.log( scope.gameState._direction[0],  scope.gameState._direction[1] )
			scope.gameState.frog = scope.frog.position;
			scope.frog.jump( scope.rock.position );
			if ( scope.frogCollision() ){
				scope.score+=2;
				scope.frog.position = scope.getNewPosition();
				$(document).trigger( 'game:frogEaten' );
			}
		}, 700 );
	};



	gameStep(){
		this.updateGame();
		this.gameState.snake = this.snake.cellPositions;
		this.gameState.direction = this.snake.cellDirections;
		this.gameState.bonus = this.bonus.position;
		this.gameState.apple = this.apple.position;
		this.gameState.rock = this.rock.position;
		this.gameState.accelerator = this.accelerator.position;

		this.gameState._direction = this.snake._cellDirections;
		this.gameState._snake = this.snake._cellPositions;

		// console.log( this.gameState._direction[2], this.snake._cellDirections[2] );

		this.interfaceController.update( this.score );
		$( document ).trigger( 'game:updated' );
		this.snake.updateOldPosition();
	};

	updateGame(){
		if ( this.DEV_PAUSE ) return;

		if ( !this.isState( this.STATE_PLAYING ))
			return;

		if ( Vector.equals( this.snake.head, this.apple.position ) ){

			this.snake.removeBlock();
			this.apple.position = this.getNewPosition();
		}
		// meeting with accelerator
		else if ( Vector.equals( this.snake.head, this.accelerator.position ) && !this.timerAccel.isActive ){

			this.timerAccel.play( this.accelerator.acceleratorDuration );
			this.stepTime *= 1 / this.accelerator.acceleratorSpeedMultiply;
			this.accelerator.position = new Vector( 0, 0 );

		}

		// 
		var event = this.snakeNearBonus() ? 'game:nearBonus:on' : 'game:nearBonus:off'; 
		$(document).trigger( event ); 



		// meeting with frog
		if ( this.frogCollision() ){
			this.score+=2;
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


		// move snake
		if ( this.chaseView )
			this.currentDirection = this.currentTurn;
		this.snake.update( this.currentDirection 	);

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

	snakeNearBonus(){
		if ( Math.abs(this.snake.head.x - this.bonus.position.x) <= 1.0 &&
			Math.abs(this.snake.head.y - this.bonus.position.y) <= 1.0 )
			return true;
		return false;
	}

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

	frogCollision(){
		if ( Vector.equals( this.snake.head, this.frog.position ) )
			return true;
		return false;
	}
	// <<< GAME LOGIC <<<

};