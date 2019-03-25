'use strict';

class Renderer {

	constructor ( configRender, params, preloader_queue ){
		this.params = params;
		this.isEnable = false;
		this.evenFrame = true;

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

		for ( var renderName in configRender.renders ){
			var renderConfig = configRender.renders[renderName];
			var renderDefault = this.defaultRender.renders[renderName];

			if( renderDefault && typeof(renderDefault.renderClass) !== undefined ){
				for ( var configName in renderConfig )
					this.defaultRender.renders[renderName][configName] = renderConfig[configName];
				this.renders[renderName] = new renderDefault.renderClass( params, renderDefault, preloader_queue );
			}
		};

		this.setActiveRenderer( configRender.activeRender );
	};

	getActiveElement(){
		return this.activeRender.getActiveElement();
	};

	setActiveRenderer( renderName ){
		if ( !this.renders[renderName].isInitialized ){
			this.renders[renderName].init( this.parentElement );
		}
		this.activeRender = this.renders[renderName];
	};

	drawFrame( gameState ){
		if ( !this.isEnable ) return;
		this.activeRender.drawFrame( gameState );
	};
}