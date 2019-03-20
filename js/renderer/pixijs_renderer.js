'use strict';

class PixiJSRenderer{

	constructor ( params, renderConfig, preloader ){
    this.isInitialized = false;
		this.params = params;

		this.height = params.blockSize * (params.areaY + 2);
		this.width = params.blockSize * (params.areaX + 2);

		this.blockSize = params.blockSize;
		// 
		this.groundBlockTexture = PIXI.Texture.fromImage( preloader.queue.getResult("ground") );

		this.wallBlockTexture = PIXI.Texture.fromImage( preloader.queue.getResult("wall") );

		this.area;
		this.head;
		this.bonus;
		// this.inits( renderConfig.appendToElement );
		// 
				

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
		var _container =  this.container;

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
		    _container.addChild(block);
			};
		};

		this.app.stage.addChild(_container);
	};

	initSnake(){
		this.head = new PIXI.Sprite(this.wallBlockTexture);
		var _head = this.head;

		_head.width = this.blockSize;
    _head.height = this.blockSize;
		_head.x = 0;
    _head.y = 0;

		this.app.stage.addChild(_head);
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
		this.updateSnake( gameState.snake );
		this.updateBonus( gameState.bonus );
	};

	clearFrame(){
		var stage = this.app.stage;
		while(stage.children[0]) {
			stage.removeChild(stage.children[0]);
		};
	};

	updateSnake( cellPositions ){
    this.head.x = cellPositions[0].x * this.blockSize;
    this.head.y = cellPositions[0].y * this.blockSize;
	};

	updateBonus( position ){
		this.bonus.x = position.x * this.blockSize;
		this.bonus.y = position.y * this.blockSize;	
	};	

	drawBlockSizeRect( posX, posY, offsetX, offsetY ){

	};
}