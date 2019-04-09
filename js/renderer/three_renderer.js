'use strict';

class ThreeRenderer{

	constructor ( params, renderConfig, preloader, gameState, game ){
		this.params = params;
  	var scope = this;

  	Math.PIhalf = Math.PI/2;

		this.areaX = params.areaX !== undefined ? params.areaX : 50;
		this.areaY = params.areaY !== undefined ? params.areaY : 5;

		this.blockSize = null;
		this.setBlockSize();

		this.chaseViewActive = false;

		this.camRotation = 2;

		this.width = this.blockSize * (this.areaX + 2);
		this.height = this.blockSize * (this.areaY + 2);
		this.newCenter = { x: ( this.areaX + 2 ) / 2, y: ( this.areaY + 2 ) / 2, z: 0 };

		this.game = game;

		this.assetManager = new AssetManager();
		

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
		// 
		this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.1, 10000 );

		this.setTopViewCamera();
		// 	top view cam
		this.topViewCamera = new THREE.PerspectiveCamera( 60, this.width / this.height, 0.1, 10000 )

		this.topViewCamera.position.x = this.newCenter.x;
		this.topViewCamera.position.y = -this.areaY ;
		this.topViewCamera.position.z = Math.min( this.areaY, this.areaX ) + 4;
		this.topViewCamera.lookAt( this.newCenter.x, -this.newCenter.y, this.newCenter.z );
		
		// 	chase view cam
		this.chaseViewCamera = new THREE.PerspectiveCamera( 80, this.width / this.height, 0.1, 10000 )

		this.chaseViewCamera.position.x = 4;
		this.chaseViewCamera.position.y = -3;
		this.chaseViewCamera.position.z = 1;
		this.chaseViewCamera.rotation.x = Math.PI / 2;
		// <<< SETUP CAMERA <<<

		
		// >>> INIT STAGE'S OBJECTS >>>	
		this.initTexture( preloader );
		this.initArea( preloader );
		this.initSkyBox( preloader );
		this.initSnake( preloader );
		this.initObejcts();
		this.initLights();
		// <<< INIT STAGE'S OBJECTS <<<
		
		this.emitterManager = new ThreeEmitterManager( preloader, this.scene );

		this.cameraTarget;

		this.addListeners();

		console.log( this.topViewCamera );
	};

	addListeners(){

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
			scope.camera.rotation.x = 1 * Math.PI / 2;
			scope.camera.rotation.z = 0 * Math.PI / 2;

			// scope.camera.lookAt( new, -headPosition.y + directions[direction][2], 0 );
			scope.chaseViewActive = true;

			var pos = scope.game.gameState.snake[0];
			scope.lastPosition = new THREE.Vector3( scope.camera.x, scope.camera.y, scope.camera.z ) 
			scope.cameraTarget = new THREE.Vector3( pos.x, -pos.y, 1 );
		})
		.on( 'game:setTopView', function( e, param ){

			scope.chaseViewActive = false;
			scope.lastPosition = new THREE.Vector3( scope.camera.x, scope.camera.y, scope.camera.z ) 
			scope.cameraTarget = new THREE.Vector3( scope.newCenter.x, -scope.areaY, Math.min( scope.areaY, scope.areaX ) + 4 );
		})
		.on( 'game:updated', function(){
			scope.lastGameUpdateTime = Date.now();
			var gameState = scope.game.gameState;
			scope.updateSnake( gameState );
		})
	};

	setTopViewCamera(){
		this.camera.position.x = this.areaX * 0.5;
		this.camera.position.y = -this.areaY * 0.75;
		this.camera.position.z = Math.min( this.areaY, this.areaX ) + 4;
		// this.camera.lookAt( this.newCenter.x, -this.newCenter.y, this.newCenter.z );
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
		this.wall_texture = new THREE.TextureLoader().load( preloader.queue.getItem( "wallDark" ).src );
		this.ground_texture = new THREE.TextureLoader().load( preloader.queue.getItem('ground').src , function ( texture ) {
			texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	  	texture.repeat.set( scope.areaX < 6 ? scope.areaX : scope.areaX - 5, scope.areaY < 6 ? scope.areaY : scope.areaY - 5 );
			texture.anisotropy = 16;
		} );
	};

	initArea( preloader ){
		var scope = this;
		
		// add ground group
		var groundGroup = new THREE.Group();
		groundGroup.applyMatrix( new THREE.Matrix4().makeTranslation( this.newCenter.x, -this.newCenter.y, 0 ) );
		this.scene.add( groundGroup );

		// init ground
		var geometry = new THREE.PlaneGeometry( this.areaX + 2, this.areaY + 2, 1 );

		var material = new THREE.MeshLambertMaterial( {
			map: this.ground_texture,
			side: THREE.DoubleSide, 
		} );

		var groundTexture = new THREE.Mesh( geometry, material );
		groundGroup.add(groundTexture);

		// init walls group
		var wallGroup = new THREE.Group();
		wallGroup.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0 ) );
		this.scene.add(wallGroup);

		// init walls
		material = new THREE.MeshLambertMaterial( { map: this.wall_texture } );

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

	initSnake( preloader ){
		var scope = this;
		this.snakeGeometryParams = {
			'snakeBody_top_left': 
			{
				start: { x: 0.5, y: 0 },
				end: { x: 0, y: -0.5 }
			},
			'snakeBody_top_right': 
			{
				start: { x: 0.5, y: 0 },
				end: { x: 1, y: -0.5 }
			},

			'snakeBody_horizontal': 
			{
				start: { x: 0, y: -0.5 },
				end: { x: 1, y: -0.5 }
			},
			'snakeBody_vertical': 
			{
				start: { x: 0.5, y: 0 },
				end: { x: 0.5, y: -1 }
			},

			'snakeBody_bottom_left': 
			{
				start: { x: 0, y: -0.5 },
				end: { x: 0.5, y: -1 }
			},
			'snakeBody_bottom_right': 
			{
				start: { x: 0.5, y: -1 },
				end: { x: 1, y: -0.5 }
 			}
		}

		// for ( var snakeName in this.snakeGeometryParams ){
		// 	this.assetManager.addAsset(
		// 		snakeName, 
		// 		50, 
		// 		function(){
		// 			var position = scope.snakeGeometryParams[snakeName];

		// 			var start = new THREE.Vector3(position.start.x-0.5, position.start.y+0.5, 0);
		//       var middle = new THREE.Vector3(0, 0, 0);
		//       var end = new THREE.Vector3(position.end.x-0.5, position.end.y+0.5, 0);

		//       var curveQuad = new THREE.QuadraticBezierCurve3(start, middle, end);
		// 			var geometry = new THREE.TubeGeometry( curveQuad, 16, 0.3, 16, false );

		// 			var material = new THREE.MeshLambertMaterial( {
		// 				color: 0x421095,
		// 				side: THREE.DoubleSide
		// 			} );
		// 			return new THREE.Mesh( geometry, material );
		// 		}
		// 	)
		// };

		// init group
		this.snake = new THREE.Group();
		this.scene.add(this.snake);
		this.snake.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.3 ) );

		var texture = this.snake_texture;

		// init snake`s head
		var geometry = new THREE.SphereGeometry( 0.45, 32, 32 );
		var material = new THREE.MeshLambertMaterial( {
			// color: 0xf5cc5a
			map: texture,
			side: THREE.DoubleSide
		} );
		// var tube = new THREE.Mesh( geometry, material );

		var head = new THREE.Mesh( geometry, material );

		head.castShadow = true;
		this.snake.add( head );
	};

	// create frog, bonus & etc
	initObejcts(){
		var scope = this;

		var objectsGroup = new THREE.Group();
		objectsGroup.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0 ) );
		this.scene.add(objectsGroup);

		// >>> create bonus
		var geometry = new THREE.SphereGeometry( 0.3, 32, 32 );
		var material = new THREE.MeshLambertMaterial( {
			color: 0xd62a2a
		} );

		function onCreateBonus() { return new THREE.Mesh( geometry, material ) };

		this.assetManager.addAsset( 'bonus', 3, onCreateBonus, undefined, undefined );
		this.cubeBonus = this.assetManager.pullAsset( 'bonus' );
		// console.log( obj )
		objectsGroup.add( this.cubeBonus );
		this.assetManager.putAsset( this.cubeBonus );

		console.log( "kk", this.assetManager, this.cubeBonus );

		// >>> create apple
		geometry = new THREE.SphereGeometry( 0.3, 32, 32 );
		material = new THREE.MeshLambertMaterial( {
			color: 0x0000ff
		} );

		this.apple = new THREE.Mesh( geometry, material );
		this.apple.castShadow = true;
		this.apple.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.10 ) );

		objectsGroup.add( this.apple );

		// >>> create accelerator
		geometry = new THREE.ConeGeometry( 0.5, 0.8, 4 );
		material = new THREE.MeshLambertMaterial( {
			color: 0xffaa00
		} );

		this.accelerator = new THREE.Mesh( geometry, material );
		this.accelerator.castShadow = true;
		this.accelerator.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.4 ) );
		this.accelerator.rotateX( Math.PI / 2 );

		objectsGroup.add( this.accelerator );

		// >>> create frog
		geometry = new THREE.SphereGeometry( 0.34, 32, 4 );
		material = new THREE.MeshLambertMaterial( {
			color: 0x33ff55
		} );

		this.frog = new THREE.Mesh( geometry, material );
		this.frog.castShadow = true;
		this.frog.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.3 ) );

		objectsGroup.add( this.frog );

		// >>> create rock
		geometry = new THREE.BoxBufferGeometry( 0.8, 0.8, 0.8 );
		material = new THREE.MeshLambertMaterial( {
					color: 0x333333,
					side: THREE.DoubleSide, 
				} );

		this.rock = new THREE.Mesh( geometry, material );
		this.rock.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.4 ) );
		this.rock.castShadow = true;
		
		objectsGroup.add( this.rock );
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

			// scope.updateSnake( gameState, delta );
			scope.updateObjects( gameState, delta );
			// 
			
			scope.updateCamera( gameState, delta );
			scope.renderer.render( scope.scene, scope.camera );
			
			// if ( scope.chaseViewActive ){
			// 	scope.updateCamera( gameState, delta );
			// 	scope.renderer.render( scope.scene, scope.chaseViewCamera );
			// }
			// else
			// 	scope.renderer.render( scope.scene, scope.topViewCamera );

			$( document ).trigger( 'three-renderer:updated', { delta: delta } )
		}());
	};

	updateCamera( gameState, delta ){

		if ( this.game.isState( this.game.STATE_PAUSE ) )
			return;

		var nowTime = Date.now();
		var delta = ( nowTime - this.lastGameUpdateTime ) * 0.001
		var stepTime = 1000 / this.game.stepTime;


		var camPosition = this.camera.position;
		var camRotation = this.camera.rotation;

		var headPosition = gameState.snake[0];
		var neckPosition = this.cameraTarget || gameState.snake[1] ;
		var lastPosition = this.lastPosition || gameState.snake[2];

		var direction = gameState.direction[0];
		var directions = {
			"up": [0, 0, -1],
			"left": [Math.PIhalf, 1, 0],
			"down": [Math.PI, 0, 1],
			"right": [Math.PIhalf*3, -1, 0]
		}

		var target = this.cameraTarget;
		var lastPos = this.lastPosition;

		camPosition.x = lastPosition.x + ( neckPosition.x - lastPosition.x ) * stepTime * delta + 0.5;
		camPosition.y = -(lastPosition.y + ( neckPosition.y - lastPosition.y ) * stepTime * delta) - 0.5;
		camPosition.z = 1;

		if ( this.chaseViewActive ){

			// calc delta time from last snake update
			// move camera
			camPosition.x = lastPosition.x + ( neckPosition.x - lastPosition.x ) * stepTime * delta + 0.5;
			camPosition.y = -(lastPosition.y + ( neckPosition.y - lastPosition.y ) * stepTime * delta) - 0.5;
			camPosition.z = 1;

			// rotate camera 
			// var direction = gameState.direction[0];
			// // var directions = {
			// // 	"up": [0, 0, -1],
			// // 	"left": [Math.PIhalf, 1, 0],
			// // 	"down": [Math.PI, 0, 1],
			// // 	"right": [Math.PIhalf*3, -1, 0]
			// // }
			// var sub = directions[direction][0] - camRotation.y;
			// if ( sub > Math.PI )
			// 	camRotation.y += 2 * Math.PI;
			// else if ( sub < -Math.PI )
			// 	camRotation.y -= 2 * Math.PI;
			// camRotation.y += sub / 8;
		}
		else{
			// this.camera.position.x = this.areaX * 0.5;
			// this.camera.position.y = -this.areaY * 0.75;
			// this.camera.position.z = Math.min( this.areaY, this.areaX ) + 4;
			// // camPosition.z -= 0.1;
			// if ( camPosition.z < )
			// this.camera.lookAt( this.newCenter.x, -this.newCenter.y, this.newCenter.z );
			// camPosition.x = this.areaX * 0.5 * stepTime * delta + 0.5;
			// camPosition.y = -this.areaY * 0.75 * stepTime * delta - 0.5;
			// camPosition.z = Math.min( this.areaY, this.areaX ) + 4;
			// this.camera.lookAt( headPosition.x + directions[direction][1], -headPosition.y - directions[direction][2], 0 );
		}

		// if ( target !== undefined ){
		// 	console.log( "fly", delta );
		// 	// camPosition.x = lastPos.x + ( target.x - lastPos.x) * stepTime * delta + 0.5;
		// 	// camPosition.y = -(lastPos.y + ( target.y - lastPos.y) * stepTime * delta) - 0.5;
		// 	// camPosition.y = lastPos.z + ( target.z - lastPos.z) * stepTime * delta + 0.5;
		// 	if ( delta + 0.1 > this.game.stepTime * 0.001 ){
		// 		target = undefined;
		// 		lastPos = undefined;
		// 	}
		// }

		if ( this.chaseViewActive ){
			if ( this.game.isState( this.game.STATE_PAUSE ) )
				return;

			// calc delta time fro mlast snake update
			var nowTime = Date.now();
			var delta = ( nowTime - this.lastGameUpdateTime ) * 0.001
			var stepTime = 1000 / this.game.stepTime;

			// move camera
			if ( target === null || target === undefined ){
				camPosition.x = lastPosition.x + ( neckPosition.x - lastPosition.x ) * stepTime * delta + 0.5;
				camPosition.y = -(lastPosition.y + ( neckPosition.y - lastPosition.y ) * stepTime * delta) - 0.5;
				camPosition.z = 1;
			}
			else{
				camPosition.x = lastPos.x + target.x * stepTime * delta + 0.5;
				camPosition.y = -(lastPos.y + target.y * stepTime * delta) - 0.5;
				camPosition.y = lastPos.z + target.z * stepTime * delta + 0.5;
			}

			// rotate camera 
			// var direction = gameState.direction[0];
			// // var directions = {
			// // 	"up": [0, 0, -1],
			// // 	"left": [Math.PIhalf, 1, 0],
			// // 	"down": [Math.PI, 0, 1],
			// // 	"right": [Math.PIhalf*3, -1, 0]
			// // }
			// var sub = directions[direction][0] - camRotation.y;
			// if ( sub > Math.PI )
			// 	camRotation.y += 2 * Math.PI;
			// else if ( sub < -Math.PI )
			// 	camRotation.y -= 2 * Math.PI;
			// camRotation.y += sub / 8;
		}
		else{
			this.camera.position.x = this.areaX * 0.5;
			this.camera.position.y = -this.areaY * 0.75;
			this.camera.position.z = Math.min( this.areaY, this.areaX ) + 4;
			// camPosition.z -= 0.1;
			// if ( camPosition.z < )
			// this.camera.lookAt( this.newCenter.x, -this.newCenter.y, this.newCenter.z );
			// camPosition.x = this.areaX * 0.5 * stepTime * delta + 0.5;
			// camPosition.y = -this.areaY * 0.75 * stepTime * delta - 0.5;
			// camPosition.z = Math.min( this.areaY, this.areaX ) + 4;
			// this.camera.lookAt( headPosition.x + directions[direction][1], -headPosition.y - directions[direction][2], 0 );
		}


		
	}

	updateSnake( gameState ){

		if ( this.game.isState( this.game.STATE_PAUSE ) )
			return;
//// сделать привязку мэша к позиции 

		var cellPositions = gameState.snake;
		var cellDirections = gameState.direction;

		var snake = this.snake.children;

		// while ( snake.length < cellDirections.length ){
		// 	var model = this.assetManager.pullAsset( 'snakeBody_horizontal' );
		// 	this.snake.add( model );
		// }

		// for ( var i = 1; i < snake.length - 1; i++ ){
		// 	var snake_geometry = 'snakeBody_' + cellDirections[i];
		// 	snake[i] = this.assetManager.pullAsset( snake_geometry );
		// }

		for ( var snakeTile in snake ){
			snake[snakeTile].position.set( cellPositions[snakeTile].x, -cellPositions[snakeTile].y, 0)
		}

	};

	updateObjects( gameState, delta ){
		if ( this.game.isState( this.game.STATE_PAUSE ) )
			return;

		this.cubeBonus.position.x = gameState.bonus.x;
		this.cubeBonus.position.y = -gameState.bonus.y 

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
