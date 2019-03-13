'use strict';

class Bonus {

	constructor( params ){
		this.params = params;

		this.pos = new Vector( params.areaX - 2, params.areaY - 2);
		this.color = params.bonusColor;
		this.blockSize = params.blockSize;

		// для анимации
		this.evenFrame = true;
	};

	// обновление позиции
	update( newPos ){
		this.pos = newPos;
	};

	// отрисовка
	draw( ctx ){
		ctx.fillStyle = this.color;
		var tmp = (this.evenFrame) ? { x: this.pos.x * this.blockSize + 1,
													 y: this.pos.y * this.blockSize + 1,
													 size: this.blockSize - 2} :
													 { x: this.pos.x * this.blockSize + 3,
													 y: this.pos.y * this.blockSize + 3,
													 size: this.blockSize - 6}
		ctx.fillRect( tmp.x, tmp.y,
									tmp.size, tmp.size)
		this.evenFrame = !this.evenFrame;
	};
};