'use strict';

class PixiJSRenderer{

	constructor ( params, renderConfig, preloader, gameState ){
		this.params = params;

		this.areaX = params.areaX !== undefined ? params.areaX : 50;
		this.areaY = params.areaY !== undefined ? params.areaY : 5;

		this.blockSize = null;
		this.setBlockSize()

		this.height = this.blockSize * (this.areaY + 2);
		this.width = this.blockSize * (this.areaX + 2);

		// >>> SETUP CANVAS >>>
		this.app = new PIXI.Application( { width: this.width,
																				height: this.height,
																				antialias: true,
																		    transparent: false,
																		    resolution: 1
																		  } );

		this.app.view.setAttribute('tabindex', 0);

		$( renderConfig.parentElement ).append( this.app.view );
		// <<< SETUP CANVAS <<<

		this.texture = {};
		this.initTexture( renderConfig, preloader, gameState );

		// тряска экрана
		this.setScreenShake( 1.2, 0.05, 15 );

		// частицы
		new EmitterManager( this.blockSize, renderConfig.emitters, preloader, this.app.stage );

	};

	getActiveElement(){
		return this.app.view;
	};

	getBlockSize(){
		return this.blockSize;
	};

	setBlockSize( areaX, areaY ){
		var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

		width -= 20;
		height -= 60

		var screenRatio = ( width ) / ( height );
		var gameRatio = ( this.areaX + 2 ) / ( this.areaY + 2 );

		this.blockSize = ( screenRatio > gameRatio ) ? ( height ) / ( this.areaY + 2 ) : ( width ) / ( this.areaX + 2 );
	};

	// >>> SET TEXTURE >>>
	initTexture( configRender, preloader, gameState ){

		for ( var textureName in configRender.textures ){
			var texture = configRender.textures[textureName];

			var atlas;

			if ( texture.path !== undefined ){
				atlas = PIXI.Texture.from( preloader.queue.getResult( texture.path ) );
			}
			else{
				console.log( textureName + " path not exsist" );
				continue;
			}

			if ( texture.sprites !== undefined ){
				for ( var spriteName in texture.sprites ){
					var sprite = texture.sprites[spriteName];
					this.texture[spriteName] = new PIXI.Texture( atlas, new Rectangle( sprite.x, sprite.y, sprite.w, sprite.h ) );
				}
			}
			else{
				this.texture[textureName] = atlas;
			}
		}

		this.initArea(gameState);
		this.initBonus();
		this.initSnake();
	};

	initArea( gameState ){
		this.container = new PIXI.Container();
		var container =  this.container;

		for (var i = 0; i < this.areaX + 2; i++) {
			for (var j = 0; j < this.areaY + 2; j++) {
				var block = gameState.area[i][j];
				if ( block != 0 )
					block = new PIXI.Sprite(this.texture['wallBlock']);
				else
					block = new PIXI.Sprite(this.texture['groundBlock']);
		    block.x = i * this.blockSize;
		    block.y = j * this.blockSize;
		    block.width = this.blockSize;
		    block.height = this.blockSize;
		    container.addChild(block);
			};
		};

		this.app.stage.addChild(container);
	};

	initSnake(){
		this.snakeContainer = new PIXI.Container();
		var container =  this.snakeContainer;

  	var cell = new PIXI.Sprite(this.texture['snakeHead_right']);
	  cell.width = this.blockSize;
	  cell.height = this.blockSize;
		container.addChild(cell);

    for (var i = 1; i < this.params.startLength - 1; i++){
    	cell = new PIXI.Sprite(this.texture['snakeBody_horizontal']);
		  cell.width = this.blockSize;
		  cell.height = this.blockSize;
			container.addChild(cell);
    }

  	cell = new PIXI.Sprite(this.texture['snakeTail_right']);
	  cell.width = this.blockSize;
	  cell.height = this.blockSize;
		container.addChild(cell);

		this.app.stage.addChild(container);
	};

	initBonus(){
		this.bonus = new PIXI.Sprite(this.texture['bonus']);
		var bonus = this.bonus;
		bonus.width = this.blockSize;
    bonus.height = this.blockSize;
		bonus.x = 0;
    bonus.y = 0;

		this.app.stage.addChild(bonus);
	}
	// <<< SET TEXTURE <<<

	// >>> DRAW >>>
	drawFrame( gameState ){
		this.updateSnake( gameState.snake, gameState.direction );
		this.updateBonus( gameState.bonus );
	};

	updateSnake( cellPositions, cellDirections ){

    var textures = this.texture;
    var container = this.snakeContainer;
    var blockSize = this.blockSize;

    while ( cellDirections.length > container.children.length ){
    	let cell = new PIXI.Sprite(textures['snakeBody_horizontal']);
		  cell.width = blockSize;
		  cell.height = blockSize;
			container.addChild(cell);
    }
    if ( cellDirections.length < container.children.length ){
    	container.children.length = cellDirections.length;
    } 

    // update positions
    for (var i = 0; i < cellPositions.length; i++ ){
    	container.getChildAt(i).x = cellPositions[i].x * blockSize;
    	container.getChildAt(i).y = cellPositions[i].y * blockSize;
    }

    // update textures
    container.getChildAt(0).texture = textures['snakeHead_' + cellDirections[0]];
    for (var i = 1; i < cellDirections.length - 1; i++ )
	    	container.getChildAt(i).texture = textures['snakeBody_' + cellDirections[i]];
    container.getChildAt(cellDirections.length - 1).texture = textures['snakeTail_' + cellDirections[cellDirections.length-1]];
	};

	updateBonus( position ){
		this.bonus.x = position.x * this.blockSize;
		this.bonus.y = position.y * this.blockSize;
	};
	// <<< DRAW <<<
	
	// тряска экрана
	setScreenShake( duration, scaleShakeValue, positionShakeValue ){

		var scope = this;
		$(document).on('game:finished', function(){

			var seconds = duration;
			var time;

			var stage = scope.app.stage;

			(function update(){

				if ( seconds < 0 ){
					stage.scale = { x: 1, y: 1 };
					stage.position = { x: 0, y:0 };
					return;
				}

				var updateId = requestAnimationFrame(update);

				var now = Date.now(),
        delta = (now - (time || now)) * 0.001;
    		time = now;
				seconds -= delta;

				stage.position.x = 0 - randomInteger(0, positionShakeValue * seconds);
				stage.position.y = 0 - randomInteger(0, positionShakeValue * seconds);
				stage.scale.x = 1.0 + scaleShakeValue * seconds;
				stage.scale.y = 1.0 + scaleShakeValue * seconds;
			}());			
		});
	};

	hide(){
		$(this.app.view).hide();
	}

	show( gameState ){
		$(this.app.view).show();
		this.drawFrame( gameState );
	}

};
