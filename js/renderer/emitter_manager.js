'use strict';

class EmitterManager{

	constructor( config, preloader, stage ){

		console.log(config);

		this.container = new PIXI.Container();

		stage.addChild( this.container );

		var scope = this;

		this.emitterSmoke = new PIXI.particles.Emitter(
			scope.container,
			[PIXI.Texture.from( preloader.queue.getResult( "cartoonSmoke" ) )],
			config.EMITTER_SMOKE
		);

		this.emitterBonus = new PIXI.particles.Emitter(
			scope.container,
			[PIXI.Texture.from( preloader.queue.getResult( 'bubbles' ) )], 
			config.EMITTER_BONUS
		);

		var elapsed = 0;

		function update(){
					
			var updateId = requestAnimationFrame(update);
			var now = Date.now();
			var delta = (now - elapsed) * 0.001;
			elapsed = now;

			scope.emitterSmoke.update(delta);
			scope.emitterBonus.update(delta);
			
		};

		update();

		$( document ).on( 'game:lose', function(e, param){
			scope.emitterSmoke.spawnPos = param;
			scope.emitterSmoke.emit = true;
			update();
		});
		
		$( document ).on( 'game:bonusUp', function(e, param){
			scope.emitterBonus.spawnPos = param;
			scope.emitterBonus.emit = true;
			update();
		});
	};
};
