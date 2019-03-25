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
		this.bonus;
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



		this.initArea();
		this.initBonus();
		this.initSnake();

		this.cccont = new PIXI.Container();

		this.app.stage.addChild( this.cccont );

		this.emitter = new PIXI.particles.Emitter(

			// The PIXI.Container to put the emitter in
			// if using blend modes, it's important to put this
			// on top of a bitmap, and not use the root stage Container
			this.cccont,
		  
			// The collection of particle images to use
			[PIXI.Texture.from('assets/CartoonSmoke.png')],
		  
			// Emitter configuration, edit this to change the look
			// of the emitter
			{
				"alpha": {
					"start": 0.8,
					"end": 0
				},
				"scale": {
					"start": 0.2,
					"end": 0.5,
					"minimumScaleMultiplier": 2
				},
				"color": {
					"start": "#ffe44c",
					"end": "#fc633c"
				},
				"speed": {
					"start": 20,
					"end": 0,
					"minimumSpeedMultiplier": 1
				},
				"acceleration": {
					"x": 1,
					"y": 1
				},
				"maxSpeed": 0,
				"startRotation": {
					"min": 0,
					"max": 360
				},
				"noRotation": false,
				"rotationSpeed": {
					"min": 0,
					"max": 40
				},
				"lifetime": {
					"min": 1,
					"max": 3
				},
				"blendMode": "normal",
				"frequency": 0.001,
				"emitterLifetime": 0.1,
				"maxParticles": 13,
				"pos": {
					"x": 100,
					"y": 100
				},
				"addAtBack": false,
				"spawnType": "point"
			}
		);

		var elapsed = 0;

		var scope = this

		var update = function(){
					
			var updateId = requestAnimationFrame(update);
			var now = Date.now();
			var delta = (now - elapsed) * 0.001;
			elapsed = now;

			scope.emitter.update(delta);
			
		};

		update();

		console.log(this.emitter)

		$( document ).on( 'game:lose', function(e, param){
			scope.emitter.spawnPos.x = param.x;
			scope.emitter.spawnPos.y = param.y;
			scope.emitter.emit = true;

			update();
		})
		$( document ).on( 'game:bonusUp', function(e, param){
			scope.emitter.spawnPos.x = param.x;
			scope.emitter.spawnPos.y = param.y;
			scope.emitter.emit = true;

			update();
		})

    this.isInitialized = true;
	};

	initArea(){
		this.container = new PIXI.Container();
		var container =  this.container;

		for (var i = 0; i < this.params.areaX + 2; i++) {
			for (var j = 0; j < this.params.areaY + 2; j++) {
				var block;
				if ( i != 0 && i != this.params.areaX + 1 && j != 0 && j != this.params.areaY + 1 )
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

    var textures = this.textures;
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