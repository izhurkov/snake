'use strict';

class PixiJSRenderer{

	constructor ( params, renderConfig, preloader ){
    this.isInitialized = false;
		this.params = params;

		this.height = params.blockSize * (params.areaY + 2);
		this.width = params.blockSize * (params.areaX + 2);

		this.blockSize = params.blockSize;

		this.textures = {};
		this.initTextures( renderConfig, preloader );

		this.area;
		this.snake = [];
		this.oldCellPositions;
		this.bonus;
	};


	initTextures( configRender, preloader ){

		this.groundBlockTexture = PIXI.Texture.from( preloader.queue.getResult("ground") );

		this.wallBlockTexture = PIXI.Texture.from( preloader.queue.getResult("wall") );

		this.snakeTextures = {};

		var snakeSprites = configRender.snakeSprites;

    var atlas = PIXI.Texture.from( preloader.queue.getResult("snake-graphics") );

		for ( var spriteName in snakeSprites ){
			var sprite = snakeSprites[spriteName];
			this.snakeTextures[spriteName] = new PIXI.Texture( atlas, new Rectangle( sprite.x, sprite.y, sprite.w, sprite.h ) );
		}

		this.bonusTexture = new PIXI.Texture( atlas, new Rectangle( 0, 192, 64, 64 ) );
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

		this.initArea();
		this.initBonus();
		this.initSnake();
    this.isInitialized = true;
	};

	initArea(){
		this.container = new PIXI.Container();
		var container =  this.container;

		for (var i = 0; i < this.params.areaX + 2; i++) {
			for (var j = 0; j < this.params.areaY + 2; j++) {
				var block;
				if ( i != 0 && i != this.params.areaX + 1 && j != 0 && j != this.params.areaY + 1 )
					block = new PIXI.Sprite(this.wallBlockTexture);
				else
					block = new PIXI.Sprite(this.groundBlockTexture);
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

  	var cell = new PIXI.Sprite(this.snakeTextures['snakeHead_right']);
	  cell.width = this.blockSize;
	  cell.height = this.blockSize;
		container.addChild(cell);

    for (var i = 1; i < this.params.startLength - 1; i++){
    	cell = new PIXI.Sprite(this.snakeTextures['snakeBody_horizontal']);
		  cell.width = this.blockSize;
		  cell.height = this.blockSize;
			container.addChild(cell);
    }

  	cell = new PIXI.Sprite(this.snakeTextures['snakeTail_right']);
	  cell.width = this.blockSize;
	  cell.height = this.blockSize;
		container.addChild(cell);

		this.app.stage.addChild(container);
	};

	initBonus(){
		this.bonus = new PIXI.Sprite(this.bonusTexture);
		var bonus = this.bonus;
		bonus.width = this.blockSize;
    bonus.height = this.blockSize;
		bonus.x = 0;
    bonus.y = 0;

		this.app.stage.addChild(bonus);
	}

	getActiveElement(){
		return this.app.view;
	}

	drawFrame( gameState ){
		this.updateSnake( gameState.snake, gameState.head );
		this.updateBonus( gameState.bonus );
	};

	clearFrame(){
		var stage = this.app.stage;
		while(stage.children[0]) {
			stage.removeChild(stage.children[0]);
		};
	};

	updateSnake( cellPositions, cellDirections ){

    var textures = this.snakeTextures;
    var container = this.snakeContainer;
    var blockSize = this.blockSize;

    if ( cellDirections.length > container.children.length ){
    	let cell = new PIXI.Sprite(textures['snakeBody_horizontal']);
		  cell.width = blockSize;
		  cell.height = blockSize;
			container.addChild(cell);
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
}