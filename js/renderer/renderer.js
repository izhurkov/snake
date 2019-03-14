'use strict';

class Renderer {

	constructor ( params ){
		this.params = params;
		this.init();

		this.height = params.blockSize * (params.areaY + 2);
		this.width = params.blockSize * (params.areaX + 2);

		this.evenFrame = true;

	};

	init(){

	};

	drawFrame( gameState ){

	};
}