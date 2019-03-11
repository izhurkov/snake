'use strict';

class Bonus {
	constructor( config ){
		this.pos = new Vector( config.areaX - 2, config.areaY - 2);
		this.color = config.bonusColor;
		this.blockSize = config.blockSize;
		this.frame = true;
	};

	update( newPos ){
		this.pos = newPos;
	};

	draw( ctx ){
		ctx.fillStyle = this.color;
		var tmp = (this.frame) ? { x: this.pos.x * this.blockSize + 1,
													 y: this.pos.y * this.blockSize + 1,
													 size: this.blockSize - 2} :
													 { x: this.pos.x * this.blockSize + 3,
													 y: this.pos.y * this.blockSize + 3,
													 size: this.blockSize - 6}
		ctx.fillRect( tmp.x, tmp.y,
									tmp.size, tmp.size)
		this.frame = !this.frame;
	};
};