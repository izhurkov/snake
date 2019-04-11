'use strict';

class ThreeEmitterManager{

	constructor( preloader, scene ){

		this.pos = new THREE.Vector3();

    var emitterSettings = {
      type: SPE.distributions.SPHERE,
      position: {
        spread: new THREE.Vector3( 1 ),
        radius: 0.5,
      },
      velocity: {
        value: new THREE.Vector3( 0, 0, 5 )
      },
      size: {
        value: [ 0.2, 4 ]
      },
      opacity: {
        value: [1, 0]
      },
      color:{
      	value: [new THREE.Color('yellow'), new THREE.Color('red')] 
      },
      particleCount: 15,
      alive: false,
      duration: 0.5,
      maxAge: {
        value: 0.9
      }
    };

    var img1 = new THREE.TextureLoader().load( preloader.queue.getItem('cartoonSmoke').src );
		var img2 = new THREE.TextureLoader().load( preloader.queue.getItem('bubbles').src );

		this.particleExplosion = new SPE.Group({
  		texture: { value: img1 },
      blending: THREE.NormalBlending
  	});
    this.particleExplosion.addPool( 10, emitterSettings, false );
  	scene.add( this.particleExplosion.mesh );


  	this.particleBonus = new SPE.Group({
  		texture: { value: img2 },
      blending: THREE.NormalBlending
  	});
    this.particleBonus.addPool( 10, emitterSettings, false );
  	scene.add( this.particleBonus.mesh );
  	
  	var scope = this;

		$( document )
		.on( 'game:finished', function( e, param ){
			var position = param;
			scope.particleExplosion.triggerPoolEmitter( 1, (scope.pos.set( position.x, - position.y, 0.5 )) );
		})
		.on( 'game:bonusTaken', function( e, param ){
      var position = param;
			scope.particleBonus.triggerPoolEmitter( 1, (scope.pos.set( position.x, - position.y, 0.5 )) );
		})
		.on( 'three-renderer:updated', function( e, param ){
			var delta = param.delta;
			scope.particleExplosion.tick( delta );
			scope.particleBonus.tick( delta );
		});


	};
};
