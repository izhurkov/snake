'use strict';

class ThreeRenderer{

	constructor ( params, renderConfig, preloader, gameState, game ){
		this.params = params;

		this.areaX = params.areaX !== undefined ? params.areaX : 50;
		this.areaY = params.areaY !== undefined ? params.areaY : 5;

		this.blockSize = null;
		this.setBlockSize()

		this.chaseViewActive = false;

		this.camRotation = 2;

		this.gameState = gameState;

		this.height = this.blockSize * (this.areaY + 2);
		this.width = ( window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth ) - 20;
		this.newCenter = { x: ( this.areaX + 2 ) / 2, y: ( this.areaY + 2 ) / 2, z: 0 };

		this.game = game;		

		// >>> SETUP CANVAS >>>
		this.scene = new THREE.Scene()
		this.renderer = new THREE.WebGLRenderer( { antialias: true} )

		this.renderer.setSize( this.width, this.height );
		this.renderer.setClearColor( 0xFFFFFF, 1);
		this.renderer.shadowMap.enabled = false;

		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		$( renderConfig.parentElement ).append( this.renderer.domElement );
		$( this.renderer.domElement ).attr('tabindex', 0);
		// <<< SETUP CANVAS <<<
		
		

		// >>> SETUP CAMERA >>>
		
		// 	top view cam
		this.topViewCamera = new THREE.PerspectiveCamera( 60, this.width / this.height, 0.1, 10000 )

		this.topViewCamera.position.x = this.newCenter.x + 0;
		this.topViewCamera.position.y = - 1.5 * this.areaY ;
		this.topViewCamera.position.z = 18;
		this.topViewCamera.lookAt( this.newCenter.x, -this.newCenter.y, this.newCenter.z );
		
		// 	chase view cam
		this.chaseViewCamera = new THREE.PerspectiveCamera( 80, this.width / this.height, 0.1, 10000 )

		this.chaseViewCamera.position.x = 4;
		this.chaseViewCamera.position.y = -3;
		this.chaseViewCamera.position.z = 1;
		this.chaseViewCamera.rotation.x = 1 * Math.PI / 2;
		this.chaseViewCamera.rotation.z = 0 * Math.PI / 2;

		// <<< SETUP CAMERA <<<

		
		// >>> INIT STAGE'S OBJECTS >>>
		
		this.initArea( preloader );
		this.initSkyBox();
		this.initSnake();
		this.initBonus();
		this.initLights();

		// <<< INIT STAGE'S OBJECTS <<<

		this.pos = new THREE.Vector3();

    var emitterSettings = {
      type: SPE.distributions.SPHERE,
      position: {
        spread: new THREE.Vector3( 1 ),
        radius: 0.1,
      },
      velocity: {
        value: new THREE.Vector3( 0, 0, 1 )
      },
      size: {
        value: [ 0.2, 4 ]
      },
      opacity: {
        value: [1, 0]
      },
      particleCount: 15,
      alive: false,
      duration: 0.01,
      maxAge: {
        value: 0.9
      }
    };

  	var scope = this;
    
		var img1 = new THREE.TextureLoader().load( preloader.queue.getItem('cartoonSmoke').src );
		var img2 = new THREE.TextureLoader().load( preloader.queue.getItem('bubbles').src );

		this.particleExplosion = new SPE.Group({
  		texture: { value: img1 },
      blending: THREE.NormalBlending
  	});
    this.particleExplosion.addPool( 10, emitterSettings, false );
  	this.scene.add( this.particleExplosion.mesh );


  	this.particleBonus = new SPE.Group({
  		texture: { value: img2 },
      blending: THREE.NormalBlending
  	});
    this.particleBonus.addPool( 10, emitterSettings, false );
  	this.scene.add( this.particleBonus.mesh );
		
		this.addListeners();
	};

	addListeners(){

		var scope = this;

		$( document )
		.on( 'game:finished', function( e, param ){
			var position = scope.game.gameState.snake[0];
			scope.createExplosion( position );
		})
		.on( 'game:bonusTaken', function( e, param ){
			var position = scope.game.gameState.snake[0];
			scope.createExplosionBonus( position );

			var seconds = 0.001 * scope.game.stepTime ;
			var duration = seconds;
			var time;

			(function update(){

				var updateId = requestAnimationFrame(update);

				var now = Date.now();
        var delta = (now - (time || now)) * 0.001;
    		time = now;
				seconds -= delta;

				if ( -seconds > 0 ){
					scope.cubeBonus.scale.set( 1, 1, 1 );
					return;
				}

				var scale = ( duration - seconds ) / duration + 0.001;
				scope.cubeBonus.scale.set( scale, scale, scale );
			}());

		})
		.on( 'timer:accel:start', function( e, param ){
			scope.accelerator.visible = false;
		})
		.on( 'timer:accel:end', function( e, param ){
			scope.accelerator.visible = true;
		})
		.on( 'game:setChaseView', function( e, param ){
			var head = scope.game.gameState.snake[1];
			var direction = scope.game.gameState.direction[0];
			scope.chaseViewCamera.position.x = head.x + 0.5;
			scope.chaseViewCamera.position.y = -head.y - 0.5;
			scope.chaseViewCamera.position.z = 1;

			var directions = {
				"up": 0,
				"left": 1,
				"down": 2,
				"right": 3
			}
			scope.chaseViewCamera.rotation.y = directions[direction] * Math.PI / 2;

			scope.chaseViewActive = true;
			$( scope.renderer.domElement ).focus();
		})
		.on( 'game:setTopView', function( e, param ){
			scope.chaseViewActive = false;
			$( scope.renderer.domElement ).focus();
		});

	};

	createExplosion( position ) {
      this.particleExplosion.triggerPoolEmitter( 1, (this.pos.set( position.x + 0.5, - position.y - 0.5, 0.5 )) );
  };

  createExplosionBonus( position ) {
      this.particleBonus.triggerPoolEmitter( 1, (this.pos.set( position.x + 0.5, - position.y - 0.5, 0.5 )) );
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

	initArea( preloader ){
		
		// add ground group
		var groundGroup = new THREE.Group();
		groundGroup.applyMatrix( new THREE.Matrix4().makeTranslation( this.newCenter.x, -this.newCenter.y, 0 ) );
		this.scene.add( groundGroup );

		// init ground texture 
		var geometry = new THREE.PlaneGeometry( this.areaX + 2, this.areaY + 2, 1 );

		var scope = this;
		var texture = new THREE.TextureLoader().load( 'assets/Ground.png' , function ( texture ) {
				texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		  texture.repeat.set( scope.areaX < 6 ? scope.areaX : scope.areaX - 5, scope.areaY < 6 ? scope.areaY : scope.areaY - 5 );
			texture.anisotropy = 16;
		} );

		var material = new THREE.MeshLambertMaterial( {
					map: texture,
					side: THREE.DoubleSide, 
				} );

		var groundTexture = new THREE.Mesh( geometry, material );
		groundTexture.receiveShadow = true;
		groundGroup.add(groundTexture);

		var wallGroup = new THREE.Group();
		wallGroup.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0 ) );
		this.scene.add(wallGroup);

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

	initSkyBox(){
		var imagePrefix = "assets/dawnmountain-";
		var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
		var imageSuffix = ".png";
		var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );	
		
		var materialArray = [];
		for (var i = 0; i < 6; i++)
			materialArray.push( new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture( imagePrefix + directions[i] + imageSuffix ),
				side: THREE.BackSide
			}));
		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		this.skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		this.skyBox.rotateX( Math.PI / 2 );
		this.skyBox.rotateY( Math.PI / 2 );
		this.scene.add( this.skyBox );
	}

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
	};

	initBonus(){
		var geometry = new THREE.SphereGeometry( 0.3, 32, 32 );
		var material = new THREE.MeshLambertMaterial( {
			color: 0xd62a2a
		} );

		this.cubeBonus = new THREE.Mesh( geometry, material );
		this.cubeBonus.castShadow = true;
		this.cubeBonus.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.10 ) );

		this.scene.add( this.cubeBonus );

		geometry = new THREE.SphereGeometry( 0.3, 32, 32 );
		material = new THREE.MeshLambertMaterial( {
			color: 0x0000ff
		} );

		this.apple = new THREE.Mesh( geometry, material );
		this.apple.castShadow = true;
		this.apple.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.10 ) );

		this.scene.add( this.apple );

		geometry = new THREE.ConeGeometry( 0.5, 0.8, 4 );
		material = new THREE.MeshLambertMaterial( {
			color: 0xffaa00
		} );

		this.accelerator = new THREE.Mesh( geometry, material );
		this.accelerator.castShadow = true;
		this.accelerator.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.4 ) );
		this.accelerator.rotateX( Math.PI / 2 );

		this.scene.add( this.accelerator );

		geometry = new THREE.SphereGeometry( 0.34, 32, 4 );
		material = new THREE.MeshLambertMaterial( {
			color: 0x33ff55
		} );

		this.frog = new THREE.Mesh( geometry, material );
		this.frog.castShadow = true;
		this.frog.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.3 ) );

		this.scene.add( this.frog );

		var rockPos = this.gameState.rock;

		geometry = new THREE.BoxBufferGeometry( 0.8, 0.8, 0.8 );
		material = new THREE.MeshLambertMaterial( {
					color: 0x333333,
					side: THREE.DoubleSide, 
				} );

		this.rock = new THREE.Mesh( geometry, material );
		this.rock.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.4 ) );
		this.rock.castShadow = true;

		this.scene.add( this.rock );
	}

	initLights(){

		this.scene.add( new THREE.AmbientLight( 0xc35321, 0.6 ) );

		this.scene.add( createLight( 0xfefefe, 0.3, 0, 0, 12, false ) );
		this.scene.add( createLight( 0xffff62, 1.0, 2 * this.areaX, this.areaY, 20, true ) );
		this.scene.add( createLight( 0xfefefe, 0.2, 0, - this.areaY - 4, 12, false )  );
		this.scene.add( createLight( 0xfefefe, 0.3, this.areaX + 2, - this.areaY - 4, 12, false )  );

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

			scope.particleExplosion.tick( delta );
			scope.particleBonus.tick( delta );

			scope.updateSnake( gameState.snake, gameState.direction, delta );
			scope.updateBonus( gameState );
			// scope.updateCamera( gameState, delta );
			if ( scope.chaseViewActive ){
				scope.updateCamera( gameState, delta );
				scope.renderer.render( scope.scene, scope.chaseViewCamera );
			}
			else
				scope.renderer.render( scope.scene, scope.topViewCamera );
		}());
	};

	updateCamera( gameState, delta ){

		var head = gameState.snake[1];
		var direction = gameState.direction[0];
		var stepTime = 1000 / this.game.stepTime;

		var headPosition = new THREE.Vector3( head.x + 0.5, -head.y - 0.5, 1 );
		var camPosition = this.chaseViewCamera.position;

		if ( camPosition.x < headPosition.x )
			camPosition.x += delta * stepTime;
		if ( camPosition.x > headPosition.x )
			camPosition.x -= delta * stepTime;

		if ( camPosition.y < headPosition.y )
			camPosition.y += delta * stepTime;
		if ( camPosition.y > headPosition.y )
			camPosition.y -= delta * stepTime;
		camPosition.z = 1.0;

		var directions = {
			"up": 0,
			"left": 1,
			"down": 2,
			"right": 3
		}

		var headRotation = directions[direction];

		if ( this.camRotation > headRotation ){
			if ( this.camRotation > 2.5 && headRotation < 0.5 )
				this.camRotation += delta * stepTime;
			else
				this.camRotation -= delta * stepTime;
		}
		if ( this.camRotation > 3.5 )
			this.camRotation = -0.5

		if ( this.camRotation < headRotation ){
			if ( this.camRotation < 0.5 && headRotation > 2.5 )
				this.camRotation -= delta * stepTime;
			else
				this.camRotation += delta * stepTime;
		}
		if ( this.camRotation < -0.5 )
			this.camRotation = 3.5


		this.chaseViewCamera.rotation.y = this.camRotation * Math.PI / 2;
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

	updateBonus( gameState ){

		this.cubeBonus.position.x = gameState.bonus.x + 0.5;
		this.cubeBonus.position.y = -gameState.bonus.y - 0.5;

		this.apple.position.x = gameState.apple.x + 0.5;
		this.apple.position.y = -gameState.apple.y - 0.5;

		this.rock.position.x = gameState.rock.x + 0.5;
		this.rock.position.y = -gameState.rock.y - 0.5;

		this.accelerator.position.x = gameState.accelerator.x + 0.5;
		this.accelerator.position.y = -gameState.accelerator.y - 0.5;
		this.accelerator.rotateY( 0.05 );

		this.frog.position.x = gameState.frog.x + 0.5;
		this.frog.position.y = -gameState.frog.y - 0.5;
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
