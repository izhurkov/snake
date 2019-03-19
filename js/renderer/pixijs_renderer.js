'use strict';

class PixiJSRenderer{

	constructor ( params, renderConfig ){
    this.isInitialized = false;
		this.params = params;

		this.height = params.blockSize * (params.areaY + 2);
		this.width = params.blockSize * (params.areaX + 2);

		this.target = $(renderConfig.appendToElement);

		this.canvas = $( this.target ).children().last();
		console.log( this.canvas );


		this.inits( renderConfig.appendToElement );
	};

	inits( target ){
		
		let app = new PIXI.Application( { width: this.width,
																			height: this.height,
																			antialias: true,
																	    transparent: false,
																	    resolution: 1
																	  } );
		
		$(target).append(app.view);
	};

	getActiveElement(){
		return this.canvas[0];
	}

	drawFrame( gameState ){
		
	};

	clearFrame(){
		
	}

	drawArea(){
		
	};

	drawSnake( cellPositions ){
		
	};

	drawBonus( position ){
		
	};	

	drawBlockSizeRect( posX, posY, offsetX, offsetY ){

	};
}