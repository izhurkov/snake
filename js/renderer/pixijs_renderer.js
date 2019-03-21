'use strict';

class PixiJSRenderer{

	constructor ( params, renderConfig, preloader ){
    this.isInitialized = false;
		this.params = params;

		this.height = params.blockSize * (params.areaY + 2);
		this.width = params.blockSize * (params.areaX + 2);

		this.blockSize = params.blockSize;
		// 
		// 
		this.textures = {};
		this.initTextures(preloader);

		this.area;
		this.snake = [];
		this.bonus;
		// this.inits( renderConfig.appendToElement );
		// 
	};

	initTextures(preloader){


		this.groundBlockTexture = PIXI.Texture.from( preloader.queue.getResult("ground") );

		this.wallBlockTexture = PIXI.Texture.from( preloader.queue.getResult("wall") );

		this.snakeTextures = {};

		var snakeSprites = {
			'snakeHead_up': 
			{ "x":192,"y":0,"w":64,"h":64 },
			'snakeHead_right': 
			{ "x":256,"y":0,"w":64,"h":64 },
			'snakeHead_left': 
			{ "x":192,"y":64,"w":64,"h":64 },
			'snakeHead_down': 
			{ "x":256,"y":64,"w":64,"h":64 },


			'snakeBody_top_left': 
			{ "x":256,"y":64,"w":64,"h":64 },
			'snakeBody_top_right': 
			{ "x":256,"y":64,"w":64,"h":64 },

			'snakeBody_horizontal': 
			{ "x":64,"y":0,"w":64,"h":64 },
			'snakeBody_vertical': 
			{ "x":256,"y":64,"w":64,"h":64 },

			'snakeBody_bottom_left': 
			{ "x":256,"y":64,"w":64,"h":64 },
			'snakeBody_bottom_right': 
			{ "x":256,"y":64,"w":64,"h":64 },

			'snakeTail_up': 
			{ "x":192,"y":128,"w":64,"h":64 },
			'snakeTail_right': 
			{ "x":256,"y":128,"w":64,"h":64 },
			'snakeTail_left': 
			{ "x":192,"y":192,"w":64,"h":64 },
			'snakeTail_down': 
			{ "x":256,"y":192,"w":64,"h":64 }
		};

    var atlas = PIXI.Texture.from( preloader.queue.getResult("snake-graphics") );

		

		for (var spriteName in snakeSprites){
			var sprite = snakeSprites[spriteName];
			this.snakeTextures[spriteName] = new PIXI.Texture(atlas, new Rectangle(sprite.x, sprite.y, sprite.w, sprite.h));
		}
		console.log("log:", this.snakeTextures);
	};

	inits( target ){
		this.app = new PIXI.Application( { width: this.width,
																				height: this.height,
																				antialias: true,
																		    transparent: false,
																		    resolution: 1
																		  } );

		this.app.view.setAttribute('tabindex', 0);

		$( target ).append( this.app.view );

		this.initArea();
		this.initSnake();
		this.initBonus();
    this.isInitialized = true;
	};

	initArea(){
		this.container = new PIXI.Container();
		var container =  this.container;

		for (var i = 0; i < this.params.areaX + 2; i++) {
			for (var j = 0; j < this.params.areaY + 2; j++) {
				var block;
				if ( i != 0 && i != this.params.areaX + 1 && j != 0 && j != this.params.areaY + 1 )
					block = new PIXI.Sprite(this.groundBlockTexture);
				else
					block = new PIXI.Sprite(this.wallBlockTexture);
		    block.x = i * this.blockSize;
		    block.y = j * this.blockSize;
		    block.width = this.blockSize;
		    block.height = this.blockSize;
		    container.addChild(block);
			};
		};

		console.log("fas", container);

		this.app.stage.addChild(container);
	};

	initSnake(){
		this.snakeContainer = new PIXI.Container();
		var container =  this.snakeContainer;

  	var cell = new PIXI.Sprite(this.snakeTextures['snakeHead_right']);
	  cell.width = this.blockSize;
	  cell.height = this.blockSize;
		container.addChild(cell);

		console.log(this.params.startLength);

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
			// this.snake.push(new PIXI.Sprite(this.snakeTextures['snakeBody_horizontal']));
		// this.snake.push(new PIXI.Sprite(this.snakeTextures['snakeTail_right']));

		// for(var cell in this.snake)
		console.log(container);

		this.app.stage.addChild(container);
	};

	initBonus(){
		this.bonus = new PIXI.Sprite(this.wallBlockTexture);
		var _bonus = this.bonus;
		_bonus.width = this.blockSize;
    _bonus.height = this.blockSize;
		_bonus.x = 0;
    _bonus.y = 0;

		this.app.stage.addChild(_bonus);
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

    if (cellDirections.length > container.children.length || cellPositions.length > container.children.length){
    	let cell = new PIXI.Sprite(this.snakeTextures['snakeBody_horizontal']);
		  cell.width = this.blockSize;
		  cell.height = this.blockSize;
			container.addChild(cell);
    }

    // update positions
    for (var i = 0; i < cellPositions.length; i++ ){
    	container.getChildAt(i).x = cellPositions[i].x * this.blockSize;
    	container.getChildAt(i).y = cellPositions[i].y * this.blockSize;
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

	drawBlockSizeRect( posX, posY, offsetX, offsetY ){

	};
}