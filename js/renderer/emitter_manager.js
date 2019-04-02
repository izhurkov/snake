'use strict';

class EmitterManager{

	constructor( blockSize, config, preloader, stage ){

		this.container = new PIXI.Container();

		stage.addChild( this.container );

		this.blockSize = blockSize;

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

		var time;

		function update(){
					
			var updateId = requestAnimationFrame(update);
			var now = Date.now(),
			delta = (now - (time || now)) * 0.001;
			time = now;

			scope.emitterSmoke.update(delta);
			scope.emitterBonus.update(delta);
			
		};

		this.emitterSmoke.emit = false;
		this.emitterBonus.emit = false;

		$( document ).on( 'game:finished', function(e, param){
			scope.emitterSmoke.spawnPos.x = param.x * blockSize + blockSize / 2;
			scope.emitterSmoke.spawnPos.y = param.y * blockSize + blockSize / 2;
			scope.emitterSmoke.emit = true;
			update();
		});
		
		$( document ).on( 'game:bonusTaken', function(e, param){
			scope.emitterBonus.spawnPos.x = param.x * blockSize + blockSize / 2;
			scope.emitterBonus.spawnPos.y = param.y * blockSize + blockSize / 2;
			scope.emitterBonus.emit = true;
			update();
		});
	};
};
