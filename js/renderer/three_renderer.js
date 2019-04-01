'use strict';

class ThreeRenderer{

	constructor ( params, renderConfig, preloader, gameState ){
		this.params = params;

		this.areaX = params.areaX !== undefined ? params.areaX : 50;
		this.areaY = params.areaY !== undefined ? params.areaY : 5;

		this.blockSize = null;
		this.setBlockSize()

		this.height = this.blockSize * (this.areaY + 2);
		this.width = this.blockSize * (this.areaX + 2);



		// >>> SETUP CANVAS >>>
		this.scene = new THREE.Scene()
		this.camera = new THREE.PerspectiveCamera( 90, this.width / this.height, 0.1, 10000 )
		this.renderer = new THREE.WebGLRenderer( { antialias: true} )

		this.renderer.setSize( this.width, this.height );
		this.renderer.setClearColor( 0xFFFFFF, 1);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		this.scene.add( new THREE.AmbientLight( 0x404040, 0.5 ) );

		$( renderConfig.parentElement ).append( this.renderer.domElement );
		$( this.renderer.domElement ).attr('tabindex', 0);
		// <<< SETUP CANVAS <<<
		
		

		// >>> SETUP CAMERA >>>
		this.newCenter = { x: ( this.areaX + 2 ) / 2, y: ( this.areaY + 2 ) / 2, z: 0 };

		this.camera.position.x = this.newCenter.x + 0;
		this.camera.position.y = - 1.5 * this.areaY ;
		this.camera.position.z = 30;
		this.camera.lookAt( new THREE.Vector3( this.newCenter.x, -this.newCenter.y, this.newCenter.z ) );
		// <<< SETUP CAMERA <<<

		
		// >>> INIT STAGE'S OBJECTS >>>
		
		this.initArea( preloader );
		this.initSnake( );
		this.initBonus();
		this.initLights();

		this.down = true;

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

		// var geometry = new THREE.PlaneGeometry( this.areaX + 2, this.areaY + 2, 1 );

		this.bgGeometry = new THREE.PlaneGeometry( this.areaX + 1.5, this.areaY + 1.5, 1 );
		this.bgMaterial = new THREE.ShadowMaterial(  );
		this.bgMaterial.opacity = 0.1;
		this.bgGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( this.newCenter.x, -this.newCenter.y, 0 ) );
		this.bg = new THREE.Mesh( this.bgGeometry, this.bgMaterial );
		this.bg.receiveShadow = true;

		var texture = new THREE.TextureLoader().load( 'assets/Ground.png' , function ( texture ) {

		   texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		   texture.repeat.set( 3, 3 );

		} );

		// var texture = 


		this.bgGeometry = new THREE.PlaneGeometry( this.areaX + 1.5, this.areaY + 1.5, 1 );
		this.bgMaterial = new THREE.MeshLambertMaterial( { map: texture } ); // 447744
		this.bgGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( this.newCenter.x, -this.newCenter.y, 0 ) );
		this.bg2 = new THREE.Mesh( this.bgGeometry, this.bgMaterial );



		var group = new THREE.Group();

		console.log(  preloader.queue )

		texture = new THREE.TextureLoader().load(
			// preloader.queue.getResult( 'wall' ).src,
			'assets/Wall.png',
			function(e){ console.log( e ) },
			undefined,
			function ( err ) { console.error( 'An error happened.', err.path ); }
		);

		var cubeMaterial = new THREE.MeshLambertMaterial( { map: texture } );

		for ( var i = 0; i < this.areaY + 2; i++ ){
			var maxRand = randomInteger( 80, 110 ) / 100;
			var cubeGeometry = new THREE.BoxBufferGeometry( maxRand, maxRand, maxRand * 0.8, 7, 7, 7 );

			var divisions = 1;
    	var modifier = new THREE.SubdivisionModifier( divisions );
    	var smooth = modifier.modify( cubeGeometry )

			var cube = new THREE.Mesh( smooth, cubeMaterial );
			cube.position.x = 0;
			cube.position.y = -i;

			var cube2 = new THREE.Mesh( cubeGeometry, cubeMaterial );
			cube2.position.x = this.areaX + 1;
			cube2.position.y = - this.areaY + i - 1;

			group.add( cube );
			group.add( cube2 );
		}

		for ( var i = 1; i < this.areaX + 1; i++ ){
			var maxRand = randomInteger( 80, 110 ) / 100;
			var cubeGeometry = new THREE.BoxGeometry( maxRand, maxRand, maxRand * 0.8, 7, 7, 7 );

    	var divisions = 1;
    	var modifier = new THREE.SubdivisionModifier( divisions );
    	var smooth = modifier.modify( cubeGeometry )

			var cube = new THREE.Mesh( smooth, cubeMaterial );
			cube.position.y = 0;
			cube.position.x = i;

			var cube2 = new THREE.Mesh( cubeGeometry, cubeMaterial );
			cube2.position.y = -this.areaY - 1;
			cube2.position.x = this.areaX + 1 - i;;

			group.add( cube );
			group.add( cube2 );
		}

		group.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.3 ) );
		this.scene.add(group);
		
		this.scene.add(this.bg);
		this.scene.add(this.bg2);
	};

	initSnake(){
		// init group
		this.snake = new THREE.Group();
		this.snake.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.21 ) );

		this.scene.add(this.snake);

		// init snake`s head
		this.cubeGeometry = new THREE.BoxGeometry( 0.8, 0.8, 0.4, 7, 7, 7 );
		this.cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xf5cc5a } );
		var divisions = 1;
    	var modifier = new THREE.SubdivisionModifier( divisions );
    	var smooth = modifier.modify( this.cubeGeometry )


		this.cube = new THREE.Mesh( smooth, this.cubeMaterial );

		this.cube.castShadow = true;
		this.snake.add( this.cube );
	};

	initBonus(){
		var geometry = new THREE.BoxGeometry( 0.8, 0.8, 0.4, 3, 3, 3 );
		geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0.5, -0.5, 0.21 ) );

		// var smooth = geometry.clone( );
		// // smooth.mergeVertices();
		// // smooth.computeVertexNormals();

  //   var divisions = 3;
  //   var modifier = new THREE.SubdivisionModifier( divisions );
  //   smooth = modifier.modify( smooth );
  //   	// modifier.supportUVs = false

		var material = new THREE.MeshLambertMaterial( { color: 0x2e2528 } );

		this.cubeBonus = new THREE.Mesh( geometry, material );
		this.cubeBonus.castShadow = true;

		this.scene.add( this.cubeBonus );
	}

	initLights(){
		
		this.scene.add( createLight( 0xfefefe, 0.4, 0, 0, 12, false ) );
		this.scene.add( createLight( 0xfefefe, 0.6, this.areaX + 2, 0, 12, true ) );
		this.scene.add( createLight( 0xfefefe, 0.2, 0, - this.areaY - 4, 12, false )  );
		this.scene.add( createLight( 0xfefefe, 0.4, this.areaX + 2, - this.areaY - 4, 12, false )  );


		function createLight( color, intensity, x, y, z, castShadow ){
			var light = new THREE.PointLight( color, intensity );
			light.position.x = x;
			light.position.y =  y;
			light.position.z = z;
			light.castShadow = castShadow;
			light.shadow.radius = 10;
			light.shadow.mapSize.x = 512;
			light.shadow.mapSize.y = 512;
			return light;
		}	
	}
	
	// <<< SET TEXTURE <<<



	// >>> DRAW >>>
	drawFrame( gameState ){

		this.updateCamera( gameState.snake, gameState.direction );
		this.updateSnake( gameState.snake );
		this.updateBonus( gameState.bonus );
		this.renderer.render( this.scene, this.camera );
		// this.composer.render();
	};

	updateCamera( cellPositions, direction ){
		// if ( this.camera.position.z > 27 )
		// 	this.down = true;
		// else if ( this.camera.position.z < 24 )
		// 	this.down = false;

		// if ( this.down ){
		// 	this.camera.position.z -= 0.08;
		// }
		// else{
		// 	this.camera.position.z += 0.08;
		// }
		// var camera_pivot = new THREE.Object3D()

		console.log( direction );

		this.camera.position.x = cellPositions[0].x + 0.5 - 2 * direction.x;
		this.camera.position.y = -cellPositions[0].y - 0.5 + 2 * direction.y;
		this.camera.position.z = 1.2;
		// camera_pivot.add( this.camera );


		// this.camera.rotateZ( 3.14 / 2 )
		// var tmpX = cellPositions[0].x + direction.x
		
		this.camera.lookAt( new THREE.Vector3( this.camera.position.x + 5 * direction.x, this.camera.position.y - 5 * direction.y, 0 ) );

		if ( Vector.equals( direction, new Vector( 1, 0 ) ) )
			this.camera.rotateZ( -1.57 );
		else if ( Vector.equals( direction, new Vector( -1, 0 ) ) )
			this.camera.rotateZ( 1.57 );
		else if ( Vector.equals( direction, new Vector( 0, 1 ) ) )
			this.camera.rotateZ( 3.14 );
		// camera_pivot.rotateOnAxis( new THREE.Vector3(1,1,0), Math.PI / 2 );    // radi
	}

	updateSnake( cellPositions ){

		if ( this.snake.children.length > cellPositions.length )
			this.snake.children.length = cellPositions.length
		while ( cellPositions.length > this.snake.children.length ){
			this.cubeGeometry = new THREE.BoxGeometry( 0.7, 0.7, 0.4 );
			this.cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfefefe } );

			this.cube = new THREE.Mesh( this.cubeGeometry, this.cubeMaterial );

			this.cube.castShadow = true;
			this.snake.add( this.cube );
		}

		for ( var i = 0; i < this.snake.children.length; i++){

			this.snake.children[i].position.x = cellPositions[i].x;
			this.snake.children[i].position.y = -cellPositions[i].y;
		}
	};

	updateBonus( position ){
		this.cubeBonus.position.x = position.x;
		this.cubeBonus.position.y = -position.y;
	};
	// <<< DRAW <<<
	


	hide(){
		$( this.renderer.domElement ).hide();
	}

	show( gameState ){
		$( this.renderer.domElement ).show();
		this.drawFrame( gameState );
	}

};
