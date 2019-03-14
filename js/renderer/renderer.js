'use strict';

class Renderer {

	constructor ( configRender, params ){
		this.params = params;
		this.init();

		this.height = params.blockSize * (params.areaY + 2);
		this.width = params.blockSize * (params.areaX + 2);

		this.evenFrame = true;

		var defaultRender = {
			canvas: {
				renderClass: CanvasRender
			}
		}

		for (var renderName in configRender){
			var renderConfig = configRender[renderName];
			var renderDefault = defaultRender[renderName];

			if( typeof(renderDefault.renderClass) !== undefined)
				this.renders[renderName] = new renderDefault.renderClass();			
		};
		console.log(this.renders);

		this.activeRender = null;


	};

	init(){

	};

	drawFrame( gameState ){

	};
}