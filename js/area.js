'use strict';

class Area {
	constructor( config ){

		this.blockColor = config.blockColor;
		this.wallColor = config.wallColor;
		this.blockSize = config.blockSize;

		this.blocks = matrixArray( config.areaX + 2, config.areaY + 2 );
		this.initBlocks();
	};

	initBlocks(){
		for ( var i = 0; i < this.blocks.length; i++ ){
			for ( var j = 0; j < this.blocks[0].length; j++ ){
				if ( i !== 0 && j !== 0
							&& i !== this.blocks.length - 1
							&& j !== this.blocks[0].length - 1)
					this.blocks[i][j] = 0;
				else
					this.blocks[i][j] = 1;
			};
		};
	};

	draw( ctx ){
		for ( var i = 0; i < this.blocks.length; i++ ){
			for ( var j = 0; j < this.blocks[0].length; j++ ){
				if ( i !== 0 && j !== 0
							&& i !== this.blocks.length - 1
							&& j !== this.blocks[0].length - 1){
					ctx.fillStyle = this.blockColor;
					ctx.fillRect( i * this.blockSize, j * this.blockSize, this.blockSize, this.blockSize );
				}
				else{
					ctx.fillStyle = this.wallColor;
					ctx.fillRect( i * this.blockSize, j * this.blockSize, this.blockSize, this.blockSize );
				}
			};
		};
	};
	
};
