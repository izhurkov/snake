'use strict';

class Renderer {

	constructor ( configRender, params, preloader_queue, gameState ){
		this.params = params;

		this.parentElement = configRender.parentElement;

		this.defaultRender = {
			renders: {
				'canvas': {
					renderClass: CanvasRenderer
				},
				'pixi': {
					renderClass: PixiJSRenderer
				}
			}
		}

		this.renders = {};

		var renderName =configRender.activeRender;
		var renderConfig = configRender.renders[renderName];
		var renderDefault = this.defaultRender.renders[renderName];

		if( renderDefault && typeof(renderDefault.renderClass) !== undefined ){
			for ( var configName in renderConfig )
				this.defaultRender.renders[renderName][configName] = renderConfig[configName];
			this.renders[renderName] = new renderDefault.renderClass( params, renderDefault, preloader_queue, gameState );
		}

		this.setActiveRenderer( configRender.activeRender );
	};

	setActiveRenderer( renderName ){
		if ( !this.renders[renderName] ) return;
		this.activeRender = this.renders[renderName];
	};

	getActiveElement(){
		return this.activeRender.getActiveElement();
	};

	getBlockSize(){
		return this.activeRender.getBlockSize();
	};

	drawFrame( gameState ){
		this.activeRender.drawFrame( gameState );
	};
}