'use strict';

class PixiJSRenderer{

	constructor ( params, renderConfig, preloader ){
    this.isInitialized = false;
		this.params = params;

		this.params.areaX = this.areaX = params.areaX !== undefined ? params.areaX : 50;
		this.params.areaY = this.areaY = params.areaY !== undefined ? params.areaY : 5;

		this.blockSize = null;
		this.setBlockSize()

		this.height = this.blockSize * (this.areaY + 2);
		this.width = this.blockSize * (this.areaX + 2);

		this.textures = {};
		this.initTextures( renderConfig, preloader );

		this.area;
		this.snake = [];
		this.bonus;
	};

	getActiveElement(){
		return this.app.view;
	};

	setBlockSize( areaX, areaY ){
		var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

		var screenRatio = ( width - 20 ) / ( height - 40 );
		var gameRatio = ( this.areaX + 2 ) / ( this.areaY + 2 );

		this.blockSize = ( screenRatio > gameRatio ) ? ( height - 40 ) / ( this.areaY + 2 ) : ( width - 20 ) / ( this.areaX + 2 );
	};

	initTextures( configRender, preloader ){

		console.log( configRender )

		for ( var textureName in configRender.textures ){
			var texture = configRender.textures[textureName];

			console.log( texture )

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
					this.textures[spriteName] = new PIXI.Texture( atlas, new Rectangle( sprite.x, sprite.y, sprite.w, sprite.h ) );
				}
			}
			else{
				this.textures[textureName] = atlas;
			}
		}

	};

	init( target ){
		this.app = new PIXI.Application( { width: this.width,
																				height: this.height,
																				antialias: true,
																		    transparent: false,
																		    resolution: 1
																		  } );

		this.app.view.setAttribute('tabindex', 0);

		$( target ).append( this.app.view );

		var scope = this;

		console.log(scope.app.stage);

		$(document).on('game:lose', function(){

			var seconds = 0.5;
			var time;

			(function update(){

				if ( seconds < 0 ){

					scope.app.stage.scale.x = 1.0;
					scope.app.stage.scale.y = 1.0;
					scope.app.stage.position.x = 0;
					scope.app.stage.position.y = 0;
					return;
				}

				var updateId = requestAnimationFrame(update);

				var now = Date.now(),
        delta = (now - (time || now)) * 0.001;
    		time = now;
				seconds -= delta;

				scope.app.stage.position.x = 0 - randomInteger(0, 10 * seconds);
				scope.app.stage.position.y = 0 - randomInteger(0, 10 * seconds);

				scope.app.stage.scale.x = 1.0 + 0.05 * seconds;
				scope.app.stage.scale.y = 1.0 + 0.05 * seconds;
			}());			
		})


		this.initArea();
		this.initBonus();
		this.initSnake();

    this.isInitialized = true;

		this.emitterManager = new EmitterManager( this.app.stage );
	};

	initArea(){
		this.container = new PIXI.Container();
		var container =  this.container;

		for (var i = 0; i < this.areaX + 2; i++) {
			for (var j = 0; j < this.areaY + 2; j++) {
				var block;
				if ( i != 0 && i != this.areaX + 1 && j != 0 && j != this.areaY + 1 )
					block = new PIXI.Sprite(this.textures['groundBlock']);
				else
					block = new PIXI.Sprite(this.textures['wallBlock']);
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

  	var cell = new PIXI.Sprite(this.textures['snakeHead_right']);
	  cell.width = this.blockSize;
	  cell.height = this.blockSize;
		container.addChild(cell);

    for (var i = 1; i < this.params.startLength - 1; i++){
    	cell = new PIXI.Sprite(this.textures['snakeBody_horizontal']);
		  cell.width = this.blockSize;
		  cell.height = this.blockSize;
			container.addChild(cell);
    }

  	cell = new PIXI.Sprite(this.textures['snakeTail_right']);
	  cell.width = this.blockSize;
	  cell.height = this.blockSize;
		container.addChild(cell);

		this.app.stage.addChild(container);
	};

	initBonus(){
		this.bonus = new PIXI.Sprite(this.textures['bonus']);
		var bonus = this.bonus;
		bonus.width = this.blockSize;
    bonus.height = this.blockSize;
		bonus.x = 0;
    bonus.y = 0;

		this.app.stage.addChild(bonus);
	}

	// >>> DRAW >>>
	drawFrame( gameState ){
		this.updateSnake( gameState.snake, gameState.head );
		this.updateBonus( gameState.bonus );
	};

	updateSnake( cellPositions, cellDirections ){

    var textures = this.textures;
    var container = this.snakeContainer;
    var blockSize = this.blockSize;

    if ( cellDirections.length > container.children.length ){
    	let cell = new PIXI.Sprite(textures['snakeBody_horizontal']);
		  cell.width = blockSize;
		  cell.height = blockSize;
			container.addChild(cell);
    } else if ( cellDirections.length < container.children.length ){
    	container.children.length = 3;
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
}