'use strict';

class CanvasRenderer{

	constructor ( params, renderConfig ){
    this.isInitialized = false;
		this.params = params;

		this.blockColor = params.blockColor !== undefined ? params.blockColor : '#0ff';
		this.wallColor = params.wallColor !== undefined ? params.wallColor : '#09f';
		this.headColor = params.headColor !== undefined ? params.headColor : '#9f0';
		this.bodyColor = params.bodyColor !== undefined ? params.bodyColor : '#9f0';
		this.bonusColor = params.bonusColor !== undefined ? params.bonusColor : '#f90';


		this.blockSize = params.blockSize !== undefined ? params.blockSize : 25;

		this.height = params.blockSize * (params.areaY + 2);
		this.width = params.blockSize * (params.areaX + 2);

		this.evenFrame = true;
	};

	init( target ){

		var newCanvas = $('<canvas/>',{
                   'class':'radHuhddd',
                    'id': 'myCanvas',
                    'tabindex':0
                }).prop({
                    width: this.width,
                    height: this.height
                });

		$( target ).append( newCanvas );
		
		this.canvas = $( newCanvas )[0];
		
		this.ctx = this.canvas.getContext( "2d" );
    this.isInitialized = true;
	};

	getActiveElement(){
		return this.canvas;
	};

	drawFrame( gameState ){
		this.clearFrame();

		this.drawArea();
		this.drawSnake( gameState.snake );
		this.drawBonus( gameState.bonus );

		this.evenFrame = !this.evenFrame;
	};

	clearFrame(){
		this.ctx.clearRect(0, 0, this.width, this.height);
	}

	drawArea(){
		this.ctx.fillStyle = this.wallColor;
		this.ctx.fillRect( 0, 0, this.width, this.height );

		this.ctx.fillStyle = this.blockColor;
		this.ctx.fillRect( this.params.blockSize, this.params.blockSize, this.width - 2 * this.params.blockSize, this.height - 2 * this.params.blockSize );
	};

	drawSnake( cellPositions ){
		this.ctx.fillStyle = this.bodyColor;
		for ( var i = 1; i < cellPositions.length; i++ ){
			var kf = this.params.blockSize * i / cellPositions.length / 4 + 2;
			this.drawBlockSizeRect( cellPositions[i].x, cellPositions[i].y, kf, kf );
		}

		this.ctx.fillStyle = this.headColor;
		this.drawBlockSizeRect( cellPositions[0].x, cellPositions[0].y, 0, 0 );
	};

	drawBonus( position ){
		this.ctx.fillStyle = this.bonusColor;
		var offset = (this.evenFrame) ? 1 : 3;
		this.drawBlockSizeRect( position.x, position.y, offset || 5, offset || 5 );
	};	

	drawBlockSizeRect( posX, posY, offsetX, offsetY ){
		let blockSize = this.params.blockSize;
		this.ctx.fillRect( blockSize * posX + offsetX,
											 blockSize * posY + offsetY,
											 blockSize - 2 * offsetX,
											 blockSize - 2 * offsetY );
	};
}