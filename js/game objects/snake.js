'use strict';

class Snake{

	constructor( params ){
		this.params = params;
		this.reset();
	};

	// позиция "головы" змейки
	get head() { return this.cellPositions[0]; };

	// возвращение начальных свойств
	reset(){
		
		this.cellPositions = [];
		this.direction = new Vector( 1, 0 );

		this.innerColor = this.params.innerColor;
		this.outerColor = this.params.outerColor;
		this.blockSize = this.params.blockSize;

		this.cellPositions.push( new Vector( this.params.startPos.x, this.params.startPos.y ) );
		for ( var i = 1; i < this.params.startLength; i++ )
			this.cellPositions.push( new Vector( this.params.startPos.x - i, this.params.startPos.y ) )
		
	}

	update( currentVelocity ){
		this.changeVelocity( currentVelocity );
		this.moveSnake();
	};

	// добавление блока в змейку (рост змеи)
	addBlock( currentVelocity ){
		this.changeVelocity( currentVelocity );
		var length = this.cellPositions.length;
		this.cellPositions.push( new Vector( this.cellPositions[length-1].x, this.cellPositions[length-1].y));
		this.moveSnake();
	};

	// движение змейки на один блок
	moveSnake(){
		for ( var i = this.cellPositions.length-1; i > 0; i-- )
			this.cellPositions[i].set( this.cellPositions[i-1].x, this.cellPositions[i-1].y );
		this.cellPositions[0].add( this.direction );
	};

	// изменение направления
	changeVelocity( currentVelocity ){
		
		var directions = {
			'right': [1, 0],
			'left': [-1, 0],
			'down': [0, 1],
			'up': [0, -1],
			'null': [1, 0]
		}

		var currentDirection = new Vector( directions[currentVelocity][0], directions[currentVelocity][1] );

		if ( Vector.equals( Vector.add( currentDirection, this.direction ), 0 ))
			return;

		this.direction.set( currentDirection );    
	};

	// отрисовка
	draw( ctx ){
		// draw body
		ctx.fillStyle = this.innerColor;
		for ( var i = 1; i < this.cellPositions.length; i++ )
			ctx.fillRect( this.cellPositions[i].x * this.blockSize + 1,
										this.cellPositions[i].y * this.blockSize + 1,
										this.blockSize - 2,
										this.blockSize - 2 );

		// draw head
		ctx.fillStyle = this.outerColor;
		ctx.fillRect( this.cellPositions[0].x * this.blockSize,
										this.cellPositions[0].y * this.blockSize,
										this.blockSize,
										this.blockSize );
	};
}