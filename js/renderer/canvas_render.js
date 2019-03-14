'use strict';

class CanvasRender extends Render{

	constructor ( params, renderConfig ){
    super();
    this.initialized = false;
		this.params = params;
		this.background = '#ddffdd';

		console.log( params, renderConfig );

		this.height = params.blockSize * (params.areaY + 2);
		this.width = params.blockSize * (params.areaX + 2);

		this.evenFrame = true;
	};

	init( elementId ){
		
		this.canvas = $( elementId )[0];
		$( this.canvas ).css( { 'width' : this.width + 'px', 
														'height' : this.height + 'px' } );
		this.ctx = canvas.getContext( "2d" );
    this.initialized = true;
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
		this.ctx.fillStyle = this.params.blockColor;
		this.ctx.fillRect( 0, 0, this.width, this.height );


		this.ctx.fillStyle = this.params.wallColor; 
		this.ctx.fillRect( 0, 0, this.width - 2 * this.blockSize, this.height - 2 * this.blockSize );
	};

	drawSnake( cellPositions ){
		// draw body
		this.ctx.fillStyle = this.params.innerColor;
		for ( var i = 1; i < this.cellPositions.length; i++ ){
			// var kf = blockSize/2 * this.cellPositions.length/i;
			drawBlockSizeRect( cellPositions[i].x, cellPositions[i].y, kf || 2, kf || 2);
		}

		// draw head
		this.ctx.fillStyle = this.params.outerColor;
		drawBlockSizeRect( cellPositions[0].x, cellPositions[0].y, 0, 0 );
	};

	drawBonus( position ){
		this.ctx.fillStyle = this.params;
		var offset = (this.evenFrame) ? 1 : 3;
		this.drawBlockSizeRect( position.y, position.y, offset || 5, offset || 5 );
	};	

	drawBlockSizeRect( posX, posY, offsetX, offsetY ){
		let blockSize = this.params.blockSize;
		this.ctx.fillRect( blockSize * posX + offsetX,
											 blockSize * posY + offsetY,
											 blockSize - 2 * offsetX,
											 blockSize - 2 * offsetY );
	};
}