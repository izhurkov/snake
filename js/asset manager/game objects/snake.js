'use strict';

class Snake{

	constructor( params ){
		this.startPos = params.startPos;
		this.startLength = params.startLength;
		this.reset();
	};

	// позиция "головы" змейки
	get head() { return this.cellPositions[0]; };

	reset(){

		this.cellPositions = [];
		this._cellPositions = []; // old position

		this.cellDirections = [];
		this.direction = new Vector( 0, 0 );

		for ( var i = 0; i < this.startLength; i++ ){
			this.cellPositions.push( new Vector( this.startPos.x - i, this.startPos.y ) )
			this._cellPositions.push( new Vector( this.startPos.x - i, this.startPos.y ) )
		}

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
		var length = this.cellPositions.length;

		this.cellPositions.push( new Vector( this.cellPositions[length-1].x, this.cellPositions[length-1].y));
		this._cellPositions.push( new Vector( this._cellPositions[length-1].x, this._cellPositions[length-1].y));
		this.cellDirections.push( this.cellDirections[length-1] );
	};

	removeBlock( ){
		return;
		
	};

	// движение змейки на один блок
	moveSnake( direction ){

		var new_pos = this.cellPositions;
		var old_pos = this._cellPositions;

		for ( var i = new_pos.length-1; i > 0; i-- ){
			new_pos[i].set( new_pos[i-1].x, new_pos[i-1].y );
		}
		new_pos[0].add( this.direction );

		var directions = { // x1_y1_x2_y2
			'1_0_1_0': 'horizontal',
			'-1_0_-1_0': 'horizontal',

			'0_1_0_1': 'vertical',
			'0_-1_0_-1': 'vertical',

			'1_0_0_-1': 'top_left',
			'1_0_0_1': 'bottom_left',
			'-1_0_0_-1': 'top_right',
			'-1_0_0_1': 'bottom_right',

			'0_1_-1_0': 'top_left',
			'0_-1_-1_0': 'bottom_left',
			'0_1_1_0': 'top_right',
			'0_-1_1_0': 'bottom_right'
		}
		
		for ( var i = new_pos.length-1; i > 0; i-- ){
			var v1 = Vector.subtract( new_pos[i], old_pos[i] );
			var v2 = Vector.subtract( new_pos[i-1], new_pos[i],  );

			var vectorString = v1.x + "_" + v1.y + "_" + v2.x + "_" + v2.y;

			this.cellDirections[i] = directions[vectorString];
		};

		if ( new_pos.length < 2 ) return;
		if ( new_pos[new_pos.length-1].x > new_pos[new_pos.length-2].x ){
				this.cellDirections[new_pos.length-1] = 'left';
		} else if ( new_pos[new_pos.length-1].x < new_pos[new_pos.length-2].x ){
				this.cellDirections[new_pos.length-1] = 'right';
		} else if ( new_pos[new_pos.length-1].y > new_pos[new_pos.length-2].y ){
				this.cellDirections[new_pos.length-1] = 'up';
		} else {
				this.cellDirections[new_pos.length-1] = 'down';
		};

		for ( var i = new_pos.length-1; i >= 0; i-- ){
			old_pos[i] = new_pos[i].clone();
		};
	};

	// изменение направления
	changeVelocity( _currentDirection ){
		
		var directions = {
			'right': [1, 0],
			'left': [-1, 0],
			'down': [0, 1],
			'up': [0, -1],
			'null': [1, 0]
		};

		var currentDirection = new Vector( directions[_currentDirection][0], directions[_currentDirection][1] );

		if ( Vector.equals( Vector.add( currentDirection, this.direction ), 0 )) return;

		this.cellDirections[0] = ( _currentDirection !== null ) ? _currentDirection : this.cellDirections[0];
		this.direction.set( currentDirection );
	};

};