'use strict';

class EmitterManager{

	constructor( stage ){

		var EMITTER_SMOKE = {
			"alpha": {
				"start": 0.8,
				"end": 0
			},
			"scale": {
				"start": 0.3,
				"end": 0.6,
				"minimumScaleMultiplier": 2
			},
			"color": {
				"start": "#ffe44c",
				"end": "#fc633c"
			},
			"speed": {
				"start": 30,
				"end": 0,
				"minimumSpeedMultiplier": 1
			},
			"acceleration": {
				"x": 1,
				"y": 1
			},
			"maxSpeed": 0,
			"startRotation": {
				"min": 0,
				"max": 360
			},
			"noRotation": false,
			"rotationSpeed": {
				"min": 0,
				"max": 40
			},
			"lifetime": {
				"min": 0.8,
				"max": 1.2
			},
			"blendMode": "normal",
			"frequency": 0.001,
			"emitterLifetime": 0.1,
			"maxParticles": 6,
			"pos": {
				"x": 100,
				"y": 100
			},
			"addAtBack": false,
			"spawnType": "point"
		};

		var EMITTER_BONUS = {
			"alpha": {
				"start": 1,
				"end": 0.18
			},
			"scale": {
				"start": 0.4	,
				"end": 0.05,
				"minimumScaleMultiplier": 1
			},
			"color": {
				"start": "#D13C2C",
				"end": "#FC968B"
			},
			"speed": {
				"start": 80,
				"end": 40,
				"minimumSpeedMultiplier": 1
			},
			"acceleration": {
				"x": 1,
				"y": 1
			},
			"maxSpeed": 0,
			"startRotation": {
				"min": 0,
				"max": 360
			},
			"noRotation": false,
			"rotationSpeed": {
				"min": 0,
				"max": 360
			},
			"lifetime": {
				"min": 0.5,
				"max": 0.7
			},
			"blendMode": "normal",
			"frequency": 0.001,
			"emitterLifetime": 0.1,
			"maxParticles": 20,
			"pos": {
				"x": 100,
				"y": 100
			},
			"addAtBack": false,
			"spawnType": "point"
		};

		this.container = new PIXI.Container();

		stage.addChild( this.container );

		var scope = this;

		this.emitterSmoke = new PIXI.particles.Emitter(
			scope.container,
			[PIXI.Texture.from('assets/CartoonSmoke.png')],
			EMITTER_SMOKE
		);

		this.emitterBonus = new PIXI.particles.Emitter(
			scope.container,
			[PIXI.Texture.from('assets/Bubbles.png')],
			EMITTER_BONUS
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
