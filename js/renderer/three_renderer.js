'use strict';

class ThreeRenderer{

	constructor ( params, renderConfig, preloader, gameState, game ){
		this.params = params;

		this.areaX = params.areaX !== undefined ? params.areaX : 50;
		this.areaY = params.areaY !== undefined ? params.areaY : 5;

		this.blockSize = null;
		this.setBlockSize()

		this.gameState = gameState;

		console.log( "wow", this.gameState );

		this.height = this.blockSize * (this.areaY + 2);
		this.width = this.blockSize * (this.areaX + 2);

		this.game = game;
		
		// >>> SETUP CANVAS >>>
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 0.1, 1000 )
		this.renderer = new THREE.WebGLRenderer( { antialias: true} )

		this.renderer.setSize( this.width, this.height );
		this.renderer.setClearColor( 0xFFFFFF, 1);
		this.renderer.shadowMap.enabled = true;

		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		// this.renderer.gammaInput = true;
		// this.renderer.gammaOutput = true;


		$( renderConfig.parentElement ).append( this.renderer.domElement );
		$( this.renderer.domElement ).attr('tabindex', 0);
		// <<< SETUP CANVAS <<<
		
		

		// >>> SETUP CAMERA >>>
		this.newCenter = { x: ( this.areaX + 2 ) / 2, y: ( this.areaY + 2 ) / 2, z: 0 };

		this.camera.position.x = this.newCenter.x + 0;
		this.camera.position.y = - 1.5 * this.areaY ;
		this.camera.position.z = 18;
		this.camera.lookAt( new THREE.Vector3( this.newCenter.x, -this.newCenter.y, this.newCenter.z ) );
		// <<< SETUP CAMERA <<<

		
		// >>> INIT STAGE'S OBJECTS >>>
		
		this.initArea( preloader );
		this.initSnake( );
		this.initBonus();
		this.initLights();

		this.down = true;

		// this.drawFrame();

		this.pos = new THREE.Vector3();

    var emitterSettings = {
      type: SPE.distributions.SPHERE,
      position: {
        spread: new THREE.Vector3(1),
        radius: 0.1,
      },
      velocity: {
        value: new THREE.Vector3( 3, 3, 0 )
      },
      size: {
        value: [ 1, 4 ]
      },
      opacity: {
        value: [1, 0]
      },
      color: {
        value: [new THREE.Color('red'),new THREE.Color('yellow')]
      },
      particleCount: 15,
      alive: false,
      duration: 0.1,
      maxAge: {
        value: 0.5
      }
    };

  	this.particleGroup = new SPE.Group({
  		texture: {
          value: THREE.ImageUtils.loadTexture('assets/CartoonSmoke.png')
      },
      blending: THREE.NormalBlending
  	});
    this.particleGroup.addPool( 10, emitterSettings, false );
  	this.scene.add( this.particleGroup.mesh );

  	this.particleBonusGroup = new SPE.Group({
  		texture: {
         value: THREE.ImageUtils.loadTexture('assets/Particle.png')
      },
      blending: THREE.NormalBlending
  	});
    this.particleBonusGroup.addPool( 10, emitterSettings, false );
  	this.scene.add( this.particleBonusGroup.mesh );
		

		var scope = this;

		$( document ).on( 'game:finished', function( e, param ){
			var position = param;
			scope.particleGroup.triggerPoolEmitter( 1, (scope.pos.set( position.x + 0.5, - position.y - 0.5, 0.5 )) );
		});

		$( document ).on( 'game:bonusTaken', function( e, param ){
			var position = param;
			scope.particleBonusGroup.triggerPoolEmitter( 1, (scope.pos.set( position.x + 0.5, - position.y - 0.5, 0.5 )) );

			var seconds = 0.001 * scope.game.stepTime ;
			var duration = seconds;
			var time;

			(function update(){

				var updateId = requestAnimationFrame(update);

				var now = Date.now();
        var delta = (now - (time || now)) * 0.001;
    		time = now;
				seconds -= delta;

				if ( seconds <= 0 ){

					scope.cubeBonus.scale.set( 1, 1, 1 );
					return;
				}

				var scale = ( duration - seconds ) / duration;

				scope.cubeBonus.scale.set( scale, scale, scale );
			}());

		} );

	};

	createExplosion( position ) {
      this.particleGroup.triggerPoolEmitter( 1, (this.pos.set( position.x + 0.5, - position.y - 0.5, 0.5 )) );
  };

  createExplosionBonus( position ) {
      this.particleBonusGroup.triggerPoolEmitter( 1, (this.pos.set( position.x + 0.5, - position.y - 0.5, 0.5 )) );
  };

	getActiveElement(){
		return this.renderer.domElement;
	};

	getBlockSize(){
		return this.blockSize;
	};

	setBlockSize( areaX, areaY ){
		var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
		var height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

		var screenRatio = ( width - 20 ) / ( height - 60 );
		var gameRatio = ( this.areaX + 2 ) / ( this.areaY + 2 );

		this.blockSize = ( screenRatio > gameRatio ) ? ( height - 60 ) / ( this.areaY + 2 ) : ( width - 20 ) / ( this.areaX + 2 );
	};



	// >>> SET OBJECTS >>>
	initTexture( configRender, preloader, gameState ){

		
	};

	initArea( preloader ){ // 0x575965
		
		var rockPos = this.gameState.rock;

		geometry = new THREE.BoxBufferGeometry( 0.8, 0.8, 0.8 );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.4 ) );
		material = new THREE.MeshLambertMaterial( {
					color: 0x333333,
					side: THREE.DoubleSide, 
				} );

		var rock = new THREE.Mesh( geometry, material );
		rock.position.x = rockPos.x;
		rock.position.y = -rockPos.y;

		this.scene.add( rock );

		// add group
		var groundGroup = new THREE.Group();
		groundGroup.applyMatrix( new THREE.Matrix4().makeTranslation( this.newCenter.x, -this.newCenter.y, 0 ) );
		this.scene.add( groundGroup );

		// init ground`s shadow
		var geometry = new THREE.PlaneGeometry( this.areaX + 2, this.areaY + 2, 1 );

		var material = new THREE.ShadowMaterial( );
		material.opacity = 0.2;

		var groundShadow = new THREE.Mesh( geometry, material );
		groundShadow.receiveShadow = true;

		groundGroup.add( groundShadow );

		var scope = this;

		// init ground texture 
		var texture = new THREE.TextureLoader().load( 'assets/Ground.png' , function ( texture ) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		  texture.repeat.set( scope.areaX < 6 ? scope.areaX : scope.areaX - 5, scope.areaY < 6 ? scope.areaY : scope.areaY - 5 );
			texture.anisotropy = 16;
		} );

		material = new THREE.MeshLambertMaterial( {
					map: texture,
					side: THREE.DoubleSide, 
				} );

		var groundTexture = new THREE.Mesh( geometry, material );

		var mesh = new THREE.Mesh( geometry, material );

		groundGroup.add(groundTexture);


		var wallGroup = new THREE.Group();
		wallGroup.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0 ) );
		this.scene.add(wallGroup);

		// console.log(  preloader.queue )

		texture = new THREE.TextureLoader().load(
			'assets/Wall2.png',
			function(e){ },
			undefined,
			function ( err ) { console.error( 'An error happened.', err.path ); }
		);

		material = new THREE.MeshLambertMaterial( { map: texture } );

		for ( var i = 0; i < this.areaY + 2; i++ ){
			var maxRand = randomInteger( 60, 95 ) / 100;
			var height = 1 - ( maxRand - 0.5 ) * 1;
			geometry = new THREE.BoxBufferGeometry( maxRand, maxRand, height );
			geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, height/2 ) );

			var cube1 = new THREE.Mesh( geometry, material );
			cube1.position.x = 0;
			cube1.position.y = -i;

			var cube2 = new THREE.Mesh( geometry, material );
			cube2.position.x = this.areaX + 1;
			cube2.position.y = - this.areaY + i - 1;

			cube2.castShadow = true;

			wallGroup.add( cube1 );
			wallGroup.add( cube2 );
		}

		for ( var i = 1; i < this.areaX + 1; i++ ){
			var maxRand = randomInteger( 60, 95 ) / 100;
			var height =  1 - ( maxRand - 0.5 ) * 1;
			geometry = new THREE.BoxBufferGeometry( maxRand, maxRand, height );
			geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, height/2 ) );

			var cube1 = new THREE.Mesh( geometry, material );
			cube1.position.y = 0;
			cube1.position.x = i;

			var cube2 = new THREE.Mesh( geometry, material );
			cube2.position.y = -this.areaY - 1;
			cube2.position.x = this.areaX + 1 - i;

			cube1.castShadow = true;

			wallGroup.add( cube1 );
			wallGroup.add( cube2 );
		}

		wallGroup.add( createWall( this.areaX + 2, 1, ( this.areaX + 2 ) / 2 - 0.5, 0, true) );
		wallGroup.add( createWall( this.areaX + 2, 1, ( this.areaX + 2 ) / 2 - 0.5, - this.areaY - 1, false) );
		wallGroup.add( createWall( 1, this.areaY, 0, - ( this.areaY ) / 2 - 0.5, false ) );
		wallGroup.add( createWall( 1, this.areaY, this.areaX + 1, -( this.areaY ) / 2 - 0.5, true ) );

		function createWall( sizeX, sixeY, positionX, positionY, castShadow ){

			geometry = new THREE.BoxBufferGeometry( sizeX, sixeY, 0.6 );
			var cube = new THREE.Mesh( geometry, material );
			cube.position.x = positionX;
			cube.position.y = positionY;
			cube.castShadow = castShadow;

			return cube;
		}
	};

	initSnake(){

		// init group
		this.snake = new THREE.Group();
		this.scene.add(this.snake);
		this.snake.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.3 ) );

		var texture = new THREE.TextureLoader().load( 'assets/Wall2.png' );

		// init snake`s head
		var geometry = new THREE.SphereGeometry( 0.45, 32, 32 );
		var material = new THREE.MeshLambertMaterial( {
			// color: 0xf5cc5a,
			side: THREE.DoubleSide, 
			map: texture
		} );

		var head = new THREE.Mesh( geometry, material );

		head.castShadow = true;
		this.snake.add( head );

		console.log( this.snake.children[0] );
	};

	initBonus(){
		var geometry = new THREE.SphereGeometry( 0.3, 32, 32 );
		var materials = new THREE.MeshLambertMaterial( {
			color: 0xd62a2a
		} );

		this.cubeBonus = new THREE.Mesh( geometry, materials );
		this.cubeBonus.castShadow = true;
		this.cubeBonus.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.10 ) );

		this.scene.add( this.cubeBonus );

		var geometry = new THREE.SphereGeometry( 0.3, 32, 32 );
		var materials = new THREE.MeshLambertMaterial( {
			color: 0x0000ff
		} );

		this.apple = new THREE.Mesh( geometry, materials );
		this.apple.castShadow = true;
		this.apple.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.10 ) );

		this.scene.add( this.apple );
	}

	initLights(){

		this.scene.add( new THREE.AmbientLight( 0x404040, 0.2 ) );

		this.scene.add( createLight( 0xfefefe, 0.4, 0, 0, 12, false ) );
		this.scene.add( createLight( 0xfefefe, 0.6, this.areaX + 2 + 5, 0 + 5, 20, true ) );
		this.scene.add( createLight( 0xfefefe, 0.2, 0, - this.areaY - 4, 12, false )  );
		this.scene.add( createLight( 0xfefefe, 0.4, this.areaX + 2, - this.areaY - 4, 12, false )  );

		function createLight( color, intensity, x, y, z, castShadow ){

			var light = new THREE.PointLight( color, intensity );
			light.position.set( x, y, z);
			
			if ( !castShadow ) return light;

			light.castShadow = castShadow;
			light.shadow.radius = 1;
			light.shadow.mapSize.x = 1024;
			light.shadow.mapSize.y = 1024;
			light.shadow.bias = 0.001;

			return light;
		}
	
	}
	// <<< SET OBJECTS <<<



	// >>> DRAW >>>
	drawFrame( ){
		let scope = this;

		var time;

		(function update(){

			var updateId = requestAnimationFrame(update);

			var gameState = scope.game.gameState;


			var now = new Date().getTime();

			var delta = ( now - (time || now) ) * 0.001;

    	time = now;

			scope.particleGroup.tick( delta );
			scope.particleBonusGroup.tick( delta );

			scope.updateSnake( gameState.snake, gameState.direction, delta );
			scope.updateBonus( gameState.bonus, gameState.apple );
			scope.renderer.render( scope.scene, scope.camera );
		}());
	};

	updateCamera( cellPositions, direction ){

	}

	updateSnake( cellPositions, cellDirections, delta ){

		var snake = this.snake.children;

		while ( cellPositions.length < snake.length ){
			snake.splice(-1,1);
		}

		while ( cellPositions.length > snake.length ){
			var cubeGeometry = new THREE.CubeGeometry(0.6, 0.6, 0.4);
			var cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfefefe } );

			var cube = new THREE.Mesh( cubeGeometry, cubeMaterial );

			cube.castShadow = true;
			this.snake.add( cube );
		};

		for ( var i = 0; i < snake.length; i++){
			snake[i].position.x = cellPositions[i].x;
			snake[i].position.y = -cellPositions[i].y;
		}
	};

	updateBonus( position1, position2 ){
		this.cubeBonus.position.x = position1.x + 0.5;
		this.cubeBonus.position.y = -position1.y - 0.5;

		this.apple.position.x = position2.x + 0.5;
		this.apple.position.y = -position2.y - 0.5;
	};
	// <<< DRAW <<<
	


	hide(){
		$( this.renderer.domElement ).hide();
	}

	show( gameState ){
		$( this.renderer.domElement ).show();
		this.drawFrame();
	}

};
