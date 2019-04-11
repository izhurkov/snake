'use strict';

class ThreeRenderer{

	constructor ( params, renderConfig, preloader, gameState, game ){
		this.params = params;
  	var scope = this;

  	Math.PIhalf = Math.PI / 2;
  	Math.PIrot = 3 * Math.PI / 8;

		this.areaX = params.areaX !== undefined ? params.areaX : 50;
		this.areaY = params.areaY !== undefined ? params.areaY : 5;

		this.blockSize = null;
		this.setBlockSize();

		this.chaseViewActive = false;

		this.camRotation = 2;

		this.width = this.blockSize * (this.areaX + 2);
		this.height = this.blockSize * (this.areaY + 2);
		this.newCenter = { x: ( this.areaX + 1 ) / 2, y: ( this.areaY + 1 ) / 2, z: 0 };

		this.game = game;

		this.assetManager = new AssetManager();
		

		// >>> SETUP CANVAS >>>
		this.scene = new THREE.Scene()
		// this.scene.fog = new THREE.Fog( 0xcd9a75, 0.01, 5000 );
		this.renderer = new THREE.WebGLRenderer( { antialias: true} )

		this.renderer.setSize( this.width, this.height );
		this.renderer.setClearColor( 0xFFFFFF, 1);
		this.renderer.shadowMap.enabled = true;

		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		$( renderConfig.parentElement ).append( this.renderer.domElement );
		$( this.renderer.domElement ).attr('tabindex', 0);
		// <<< SETUP CANVAS <<<

		// >>> SETUP CAMERA >>>
		// this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 10000 );

		// 	top view cam
		this.topViewCamera = new THREE.PerspectiveCamera( 60, this.width / this.height, 0.1, 10000 )

		this.topViewCameraZ = Math.max( this.areaY, this.areaX );

		this.topViewCamera.position.x = this.newCenter.x;
		this.topViewCamera.position.y = -this.areaY ;
		this.topViewCamera.position.z = this.topViewCameraZ;
		this.topViewCamera.lookAt( this.newCenter.x, -this.newCenter.y, this.newCenter.z );
		
		// 	chase view cam
		this.chaseViewCamera = new THREE.PerspectiveCamera( 80, this.width / this.height, 0.1, 10000 )

		this.chaseViewCamera.position.x = 4;
		this.chaseViewCamera.position.y = -3;
		this.chaseViewCamera.position.z = 1;
		// this.chaseViewCamera.rotation.z = 3 * Math.PI / 2 ;
		// <<< SETUP CAMERA <<<

		
		// >>> INIT STAGE'S OBJECTS >>>	
		this.initTexture( preloader );
		this.initArea( preloader );
		this.initSkyBox( preloader );
		this.initSnake( preloader, renderConfig );
		this.initObejcts();
		this.initLights();
		// <<< INIT STAGE'S OBJECTS <<<
		
		this.emitterManager = new ThreeEmitterManager( preloader, this.scene );

		this.cameraTarget;

		this.addListeners( renderConfig );

		this.directions = {
			"up": [0, 0, Math.PIrot],
			"left": [Math.PIhalf, Math.PIrot, 0],
			"down": [Math.PI, 0, -Math.PIrot],
			"right": [Math.PIhalf * 3, -Math.PIrot, 0]
		};
	};

	addListeners( renderConfig ){

		var scope = this;

		$( document )
		.on( 'game:bonusTaken', function( e, param ){

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
					scope.bonus.scale.set( 1, 1, 1 );
					return;
				}

				var scale = ( duration - seconds ) / duration + 0.001;
				scope.bonus.scale.set( scale, scale, scale );
			}());

		})
		.on( 'timer:accel:start', function( e, param ){
			scope.accelerator.visible = false;
		})
		.on( 'timer:accel:end', function( e, param ){
			scope.accelerator.visible = true;
		})
		.on( 'game:setChaseView', function( e, param ){
			scope.chaseViewActive = true;
		})
		.on( 'game:setTopView', function( e, param ){
			scope.chaseViewActive = false;
		})
		.on( 'game:updated', function(){
			scope.lastGameUpdateTime = Date.now();
			var gameState = scope.game.gameState;
			scope.updateSnake( gameState );
		})
		.on( 'game:nearBonus:on', function(){
			var head = scope.snake.children[0];
			head.geometry.parameters.phiLength = 1;
		})
		.on( 'game:nearBonus:off', function(){
			var head = scope.snake.children[0];
			head.geometry.parameters.phiLength = 2 * Math.PI;
		})
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





	// ██╗███╗   ██╗██╗████████╗     ██████╗ ██████╗      ██╗███████╗ ██████╗████████╗███████╗
	// ██║████╗  ██║██║╚══██╔══╝    ██╔═══██╗██╔══██╗     ██║██╔════╝██╔════╝╚══██╔══╝██╔════╝
	// ██║██╔██╗ ██║██║   ██║       ██║   ██║██████╔╝     ██║█████╗  ██║        ██║   ███████╗
	// ██║██║╚██╗██║██║   ██║       ██║   ██║██╔══██╗██   ██║██╔══╝  ██║        ██║   ╚════██║
	// ██║██║ ╚████║██║   ██║       ╚██████╔╝██████╔╝╚█████╔╝███████╗╚██████╗   ██║   ███████║
	// ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝        ╚═════╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝   ╚══════╝

	// >>> SET OBJECTS >>>
	initTexture( preloader ){
		var scope = this;
		this.snake_texture = new THREE.TextureLoader().load( preloader.queue.getItem( "snake-texture" ).src );
		this.wall_texture = new THREE.TextureLoader().load( preloader.queue.getItem( "wallDark" ).src, function( texture ) {
			texture.anisotropy = 16;
		});
		this.ground_texture = new THREE.TextureLoader().load( preloader.queue.getItem('ground').src , function ( texture ) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	  	texture.repeat.set( scope.areaX < 6 ? scope.areaX : scope.areaX - 5, scope.areaY < 6 ? scope.areaY : scope.areaY - 5 );
			texture.anisotropy = 16;
		});
	};

	initArea( preloader ){
		var scope = this;
		
		// add ground group
		var groundGroup = new THREE.Group();
		groundGroup.applyMatrix( new THREE.Matrix4().makeTranslation( this.newCenter.x, -this.newCenter.y, -0.3 ) );
		this.scene.add( groundGroup );

		// init ground
		var geometry = new THREE.PlaneGeometry( this.areaX + 2, this.areaY + 2, 1 );

		var material = new THREE.MeshLambertMaterial( {
			map: this.ground_texture,
			side: THREE.DoubleSide,
		} );

		var groundTexture = new THREE.Mesh( geometry, material );
		groundTexture.receiveShadow = true;
		groundGroup.add(groundTexture);

		// init walls group
		var wallGroup = new THREE.Group();
		wallGroup.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0, -0.3 ) );
		this.scene.add(wallGroup);

		// init walls
		material = new THREE.MeshLambertMaterial( { map: this.wall_texture } );

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

			geometry = new THREE.BoxBufferGeometry( sizeX, sixeY, 0.8 );
			var cube = new THREE.Mesh( geometry, material );
			cube.position.x = positionX;
			cube.position.y = positionY;
			cube.castShadow = castShadow;
			return cube;
		}
	};

	initSkyBox( preloader ){
		var imagePrefix = "dawnmountain-";
		var directions  = ["xpos", "xneg", "ypos", "yneg", "zpos", "zneg"];
		var skyGeometry = new THREE.CubeGeometry( 5000, 5000, 5000 );	
		
		var materialArray = [];
		for (var i = 0; i < 6; i++)
			materialArray.push( new THREE.MeshBasicMaterial({
				map: THREE.ImageUtils.loadTexture( preloader.queue.getItem( imagePrefix + directions[i] ).src ),
				side: THREE.BackSide
			}));
		var skyMaterial = new THREE.MeshFaceMaterial( materialArray );
		this.skyBox = new THREE.Mesh( skyGeometry, skyMaterial );
		this.skyBox.rotateX( Math.PI / 2 );
		this.skyBox.rotateY( Math.PI / 2 );
		this.scene.add( this.skyBox );
	}

	initSnake( preloader, renderConfig ){

		var scope = this;
		var snakeGeometryParams = renderConfig.snakeGeometryParams;
		var texture = this.snake_texture;
		var material = new THREE.MeshLambertMaterial( {
			map: texture,
			side: THREE.DoubleSide
		} );

		for ( var snakeName in snakeGeometryParams ){
			if ( snakeName.includes("snakeBody") ){
				this.assetManager.addAsset(
					snakeName, 
					20, 
					function(){
						var position = snakeGeometryParams[snakeName];

						var start = new THREE.Vector3(position.start.x-0.5, position.start.y+0.5, 0);
			      var middle = new THREE.Vector3(0, 0, 0);
			      var end = new THREE.Vector3(position.end.x-0.5, position.end.y+0.5, 0);

			      var curveQuad = new THREE.QuadraticBezierCurve3(start, middle, end);
						var geometry = new THREE.TubeGeometry( curveQuad, 16, 0.3, 16, false );
						var obj = new THREE.Mesh( geometry, material );
						obj.snakeName = snakeName;
						obj.castShadow = true;
						return obj;
					}
				)
			}
			else if ( snakeName.includes("snakeTail") ){
				this.assetManager.addAsset(
					snakeName, 
					20, 
					function(){
						var geometry = new THREE.CylinderGeometry( 0.3, 0.1, 1, 32 );
						geometry.rotateZ( snakeGeometryParams[snakeName].rotation);
						var obj = new THREE.Mesh( geometry, material );
						obj.snakeName = snakeName;
						obj.castShadow = true;
						return obj;
					}
				)
			}		
		};

		// init group
		this.snake = new THREE.Group();
		this.scene.add(this.snake);

		// init snake`s head
		var geometry = new THREE.SphereGeometry( 0.45, 32, 32, 0 );
		var head = new THREE.Mesh( geometry, material );
		
		head.castShadow = true;
		this.snake.add( head );
	};

	// create frog, bonus & etc
	initObejcts(){
		var scope = this;

		var objectsGroup = new THREE.Group();
		this.scene.add(objectsGroup);


		// >>> create bonus
		function onCreateBonus() {
			return new THREE.Mesh(
				new THREE.SphereGeometry( 0.3, 32, 32 ),
				new THREE.MeshLambertMaterial( {
					color: 0xd62a2a
				} )
		) };
		this.assetManager.addAsset( 'bonus', 3, onCreateBonus, undefined, undefined );
		this.bonus = this.assetManager.pullAsset( 'bonus' );
		this.bonus.castShadow = true;

		// >>> create apple
		function onCreateApple() {
			return new THREE.Mesh(
				new THREE.SphereGeometry( 0.3, 32, 32 ),
				new THREE.MeshLambertMaterial( {
					color: 0x0000ff
				} )
		) };
		this.assetManager.addAsset( 'apple', 3, onCreateApple, undefined, undefined );
		this.apple = this.assetManager.pullAsset( 'apple' );
		this.apple.castShadow = true;

		// >>> create accelerator
		function onCreateAccelerator() {
			return new THREE.Mesh(
				new THREE.ConeGeometry( 0.5, 0.58, 4 ),
				new THREE.MeshLambertMaterial( {
					color: 0xffaa00
				} )
		) };
		this.assetManager.addAsset( 'accelerator', 3, onCreateAccelerator, undefined, undefined );
		this.accelerator = this.assetManager.pullAsset( 'accelerator' );
		this.accelerator.rotateX( Math.PI / 2 );
		this.accelerator.castShadow = true;

		// >>> create frog
		function onCreateFrog() {
			return new THREE.Mesh(
				new THREE.SphereGeometry( 0.30, 16, 4 ),
				new THREE.MeshLambertMaterial( {
					color: 0x33ff55
				} )
		) };
		this.assetManager.addAsset( 'frog', 3, onCreateFrog, undefined, undefined );
		this.frog = this.assetManager.pullAsset( 'frog' );
		this.frog.castShadow = true;

		// >>> create rock
		function onCreateRock() {
			return new THREE.Mesh(
				new THREE.BoxBufferGeometry( 0.8, 0.8, 0.6 ),
				new THREE.MeshLambertMaterial( {
					color: 0x333333,
					side: THREE.DoubleSide
				} )
		) };
		this.assetManager.addAsset( 'rock', 3, onCreateRock, undefined, undefined );
		this.rock = this.assetManager.pullAsset( 'rock' );
		this.rock.castShadow = true;

		
		objectsGroup.add( this.bonus );
		objectsGroup.add( this.apple );
		objectsGroup.add( this.accelerator );
		objectsGroup.add( this.frog );
		objectsGroup.add( this.rock );
	}

	initLights(){

		this.scene.add( new THREE.AmbientLight( 0xc35321, 0.6 ) );

		this.scene.add( createLight( 0xfefefe, 0.3, 0, 0, 12, false ) );
		this.scene.add( createLight( 0xffff62, 1.0, 2 * this.areaX, this.areaY, 28, true ) );
		this.scene.add( createLight( 0xfefefe, 0.2, 0, - this.areaY - 4, 12, false )  );
		this.scene.add( createLight( 0xfefefe, 0.3, this.areaX + 2, - this.areaY - 4, 12, false )  );

		function createLight( color, intensity, x, y, z, castShadow ){

			var light = new THREE.PointLight( color, intensity );
			light.position.set( x, y, z);
			
			if ( !castShadow ) return light;

			light.castShadow = castShadow;
			light.shadow.radius = 2;
			light.shadow.mapSize.x = 1024;
			light.shadow.mapSize.y = 1024;
			light.shadow.bias = 0.001;

			return light;
		}	
	}
	// <<< SET OBJECTS <<<




	// ██████╗ ███████╗███╗   ██╗██████╗ ███████╗██████╗ 
	// ██╔══██╗██╔════╝████╗  ██║██╔══██╗██╔════╝██╔══██╗
	// ██████╔╝█████╗  ██╔██╗ ██║██║  ██║█████╗  ██████╔╝
	// ██╔══██╗██╔══╝  ██║╚██╗██║██║  ██║██╔══╝  ██╔══██╗
	// ██║  ██║███████╗██║ ╚████║██████╔╝███████╗██║  ██║
	// ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝╚═════╝ ╚══════╝╚═╝  ╚═╝

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

			scope.updateObjects( gameState, delta );
			
			scope.updateCamera( gameState, delta );

			if ( scope.chaseViewActive ){
				scope.renderer.render( scope.scene, scope.chaseViewCamera );
			}
			else{
				scope.renderer.render( scope.scene, scope.topViewCamera );
			}

			$( document ).trigger( 'three-renderer:updated', { delta: delta } )
		}());
	};

	updateCamera( gameState, delta ){

		var position = this.topViewCamera.position;
		position.z = this.topViewCameraZ + this.accelerator.rotation.y / 4;
		position.y = -this.areaY - this.accelerator.rotation.y / 4;
		this.topViewCamera.lookAt( this.newCenter.x, -this.newCenter.y - 1, this.newCenter.z )

		if ( this.game.isState( this.game.STATE_PAUSE ) || this.game.isState( this.game.STATE_FINISHED ) )
			return;

		// calc delta time from last snake update
		var nowTime = Date.now();
		var delta = ( nowTime - this.lastGameUpdateTime ) * 0.001
		var stepTime = 1000 / this.game.stepTime;

		var camPosition = this.chaseViewCamera.position;
		var camRotation = this.chaseViewCamera.rotation;

		var targetPosition = gameState.snake[1] ;
		var lastPosition = gameState.snake[2];

		var direction = gameState.direction[0];

		// move camera
		camPosition.x = lastPosition.x + ( targetPosition.x - lastPosition.x ) * stepTime * delta ;
		camPosition.y = -(lastPosition.y + ( targetPosition.y - lastPosition.y ) * stepTime * delta);
		camPosition.z = 1.2;

		// rotate camera
		var direction = gameState.direction[0];

		var subZ = this.directions[direction][0] - camRotation.z;
		var subY = this.directions[direction][1] - camRotation.y;
		var subX = this.directions[direction][2] - camRotation.x;

		if ( subZ > Math.PI )
			camRotation.z += 2 * Math.PI;
		else
			if ( subZ < -Math.PI  )
				camRotation.z -= 2 * Math.PI;
		if ( Math.abs(subZ) > Math.PI )
			subZ = this.directions[direction][0] - camRotation.z;

		camRotation.z += subZ / 8;
		camRotation.y += subY / 5;
		camRotation.x += subX / 5;
	}

	updateSnake( gameState ){

		if ( this.game.isState( this.game.STATE_PAUSE ) )
			return;

		var cellPositions = gameState.snake;
		var cellDirections = gameState.direction;

		var snake = this.snake.children;

		while ( snake.length < cellDirections.length ){
			var model = this.assetManager.pullAsset( 'snakeBody_vertical' );
			this.snake.add( model );
		}

		while ( snake.length > cellDirections.length ){
			var asset = snake.splice( -1, 1 );
			this.assetManager.putAsset( asset );
		}

		for ( var i = 1; i < snake.length - 1; i++ ){
			var snake_geometry = 'snakeBody_' + cellDirections[i];
			this.assetManager.putAsset( snake[i] );
			var model = this.assetManager.pullAsset( snake_geometry );
			snake[i] = model;
		}

		this.assetManager.putAsset( snake[cellDirections.length-1] );
		snake[cellDirections.length-1] = this.assetManager.pullAsset( 'snakeTail_' + cellDirections[cellDirections.length-1] );

		for ( var snakeTile in snake ){
			snake[snakeTile].position.set( cellPositions[snakeTile].x, -cellPositions[snakeTile].y, 0);
		}
	};

	updateObjects( gameState, delta ){
		if ( this.game.isState( this.game.STATE_PAUSE ) )
			return;

		this.bonus.position.x = gameState.bonus.x;
		this.bonus.position.y = -gameState.bonus.y 

		this.apple.position.x = gameState.apple.x;
		this.apple.position.y = -gameState.apple.y;

		this.rock.position.x = gameState.rock.x;
		this.rock.position.y = -gameState.rock.y;

		this.accelerator.position.x = gameState.accelerator.x;
		this.accelerator.position.y = -gameState.accelerator.y;
		this.accelerator.rotateY( 0.05 );

		this.frog.position.x = gameState.frog.x;
		this.frog.position.y = -gameState.frog.y;
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
