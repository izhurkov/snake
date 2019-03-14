'use strict';

class Renderer {

	constructor ( configRender, params ){
		this.params = params;
		this.init();

		this.height = params.blockSize * (params.areaY + 2);
		this.width = params.blockSize * (params.areaX + 2);

		this.evenFrame = true;

		this.defaultRender = {
			renders: {
				'canvas': {
					renderClass: CanvasRender
				}
			}
		}

		this.renders = {};

		for ( var renderName in configRender.renders ){
			var renderConfig = configRender.renders[renderName];
			var renderDefault = this.defaultRender.renders[renderName];

			if( renderDefault && typeof(renderDefault.renderClass) !== undefined ){
				this.renders[renderName] = new renderDefault.renderClass();
				for ( var configName in renderConfig )
					this.defaultRender.renders[renderName][configName] = renderConfig[configName];
			}
		};

		this.setActiveRender( configRender.activeRender );


	};

	setActiveRender( renderName ){
		if ( !this.renders[renderName].initialized )
			this.renders[renderName].init( this.defaultRender.renders[renderName].elementId);
		this.activeRender = this.renders[renderName];
	};

	init(){
		for (var renderName in this.renders){
			this.renders[renderName].init();
		};
	};

	drawFrame( gameState ){
		this.activeRender.drawFrame( gameState );
	};
}