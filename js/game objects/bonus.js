'use strict';

class Bonus {

	constructor( params ){
		this.params = params;

		this.position = new Vector( params.areaX - 2, params.areaY - 2);
		this.color = params.bonusColor;
		this.blockSize = params.blockSize;

		// для анимации
		this.evenFrame = true;
	};
};