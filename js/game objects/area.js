'use strict';

class Area {

	constructor( params ){
		this.blockColor = params.blockColor;
		this.wallColor = params.wallColor;
		this.blockSize = params.blockSize;

		this.blocks = matrixArray( params.areaX + 2, params.areaY + 2 );
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
		ctx.fillStyle = this.wallColor;
		ctx.fillRect( 0, 0, this.blocks.length * this.blockSize, this.blocks[0].length * this.blockSize );

		ctx.fillStyle = this.blockColor;
		ctx.fillRect( this.blockSize,
									this.blockSize,
									(this.blocks.length - 2) * this.blockSize,
									(this.blocks[0].length - 2) * this.blockSize );
	};
	
};
