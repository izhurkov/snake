'use strict';

class Renderer {

	constructor ( configRender, params, preloader, gameState, game ){
		this.params = params;

		this.parentElement = configRender.parentElement;

		this.defaultRender = {
			renders: {
				'canvas': {
					renderClass: CanvasRenderer
				},
				'three': {
					renderClass: ThreeRenderer
				},
				'pixi': {
					renderClass: PixiJSRenderer
				}
			}
		}

		this.gameState = gameState;

		this.activeRender = null;

		this.renders = {};

		for ( var renderName in configRender.renders ){
			var renderConfig = configRender.renders[renderName];
			var renderDefault = this.defaultRender.renders[renderName];

			if( renderDefault && typeof(renderDefault.renderClass) !== undefined ){
				for ( var configName in renderConfig )
					this.defaultRender.renders[renderName][configName] = renderConfig[configName];
				this.renders[renderName] = new renderDefault.renderClass( params, renderDefault, preloader, gameState, game );
			}
			this.renders[renderName].hide();
		};

		this.setActiveRenderer( configRender.activeRender );
	};

	getGameState(){
		return this.gameState;
	}

	setActiveRenderer( renderName ){
		if ( !this.renders[renderName] ) return;
		if ( this.activeRender !== null )
			this.activeRender.hide();
		this.activeRender = this.renders[renderName];
		this.activeRender.show( this.getGameState() );
	};

	getActiveElement(){
		return this.activeRender.getActiveElement();
	};

	getBlockSize(){
		return this.activeRender.getBlockSize();
	};

	drawFrame( gameState ){
		this.gameState = gameState;
		// console.log("drawFrame", gameState)
		// this.activeRender.drawFrame(  );
	};
}