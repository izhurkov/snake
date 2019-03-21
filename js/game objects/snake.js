'use strict';

class Snake{

	constructor( params ){
		this.startPos = params.startPos;
		this.startLength = params.startLength;
		this.reset();
	};

	// позиция "головы" змейки
	get head() { return this.cellPositions[0]; };

	// возвращение начальных свойств
	reset(){

		this.cellPositions = [];
		this.cellDirections = [];
		this.direction = new Vector( 1, 0 );

		this.cellPositions.push( new Vector( this.startPos.x, this.startPos.y ) );
		for ( var i = 1; i < this.startLength; i++ )
			this.cellPositions.push( new Vector( this.startPos.x - i, this.startPos.y ) )

		this.cellDirections.push( 'right' );
		for ( var i = 1; i < this.startLength - 1; i++ )
			this.cellDirections.push( 'horizontal' );
		this.cellDirections.push( 'right' );
	}

	update( currentVelocity ){
		this.changeVelocity( currentVelocity );
		this.moveSnake( this.direction );
	};

	// добавление блока в змейку (рост змеи)
	addBlock( currentVelocity ){
		this.changeVelocity( currentVelocity );
		var length = this.cellPositions.length;
		this.cellPositions.push( new Vector( this.cellPositions[length-1].x, this.cellPositions[length-1].y));
		// this.cellDirections.push( Object.assign( cellDirections[length] ) );
		this.moveSnake( this.direction );
	};

	// движение змейки на один блок
	moveSnake( direction ){
		for ( var i = this.cellPositions.length-1; i > 0; i-- ){
			this.cellPositions[i].set( this.cellPositions[i-1].x, this.cellPositions[i-1].y );
		}
		this.cellPositions[0].add( this.direction );

		var directions = this.cellDirections;
		var length = directions.length;

		for ( var i = length-1; i > 1; i-- ){
			directions[i] = directions[i-1];
		}
	};

	bounceWall(){
		this.cellPositions[0].add( this.direction.multiply( -1 ) );
	};

	// изменение направления
	changeVelocity( _currentDirection ){
		
		var directions = {
			'right': [1, 0],
			'left': [-1, 0],
			'down': [0, 1],
			'up': [0, -1],
			'null': [1, 0]
		}
		var currentDirection = new Vector( directions[_currentDirection][0], directions[_currentDirection][1] );

		if ( Vector.equals( Vector.add( currentDirection, this.direction ), 0 ))
			return;

		this.cellDirections[0] = (_currentDirection !== null) ? _currentDirection : this.cellDirections[0];

		this.direction.set( currentDirection );
	};

	// changeCellDirections(){
	// 	var directions = this.cellDirections;
	// 	directions[0] = currentDirection;
	// 	var length = directions.length;

	// 	for ( var i = length - 1; i > 0; i-- ){
	// 		directions[i] = this.cellPositions[i].set( this.cellPositions[i-1].x, this.cellPositions[i-1].y );
	// 	this.cellPositions[0].add( this.direction );
	// 	}
	// };
}