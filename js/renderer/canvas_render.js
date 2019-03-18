'use strict';

class CanvasRender{

	constructor ( params, renderConfig ){
    this.isInitialized = false;
		this.params = params;

		this.height = params.blockSize * (params.areaY + 2);
		this.width = params.blockSize * (params.areaX + 2);

		this.evenFrame = true;
	};

	inits( elementId ){
		
		this.canvas = $( elementId )[0];
		$( this.canvas ).css( { 'width' : this.width + 'px', 
														'height' : this.height + 'px' } );
		this.ctx = canvas.getContext( "2d" );
    this.isInitialized = true;
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
		this.ctx.fillStyle = this.params.wallColor || '#0ff';
		this.ctx.fillRect( 0, 0, this.width, this.height );

		this.ctx.fillStyle = this.params.blockColor || '#0ff';;
		this.ctx.fillRect( this.params.blockSize, this.params.blockSize, this.width - 2 * this.params.blockSize, this.height - 2 * this.params.blockSize );
	};

	drawSnake( cellPositions ){
		this.ctx.fillStyle = this.params.bodyColor || '#ff0';;
		for ( var i = 1; i < cellPositions.length; i++ ){
			var kf = this.params.blockSize * i / cellPositions.length / 4 + 2;
			this.drawBlockSizeRect( cellPositions[i].x, cellPositions[i].y, kf, kf );
		}

		this.ctx.fillStyle = this.params.headColor || '#ff0';;
		this.drawBlockSizeRect( cellPositions[0].x, cellPositions[0].y, 0, 0 );
	};

	drawBonus( position ){
		this.ctx.fillStyle = this.params.bonusColor || '#0ff';;
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