'use strict';

class Snake{

	constructor( params ){
		this.params = params;
		
		this.pos = [];
		this.velocity = new Vector( 1, 0 );

		this.innerColor = params.innerColor;
		this.outerColor = params.outerColor;
		this.blockSize = params.blockSize;

		this.pos.push( new Vector( params.startPos.x, params.startPos.y ) );
		for ( var i = 1; i < params.startLength; i++ )
			this.pos.push( new Vector( params.startPos.x - i, params.startPos.y ) )
	};

	// позиция "головы" змейки
	get head() { return this.pos[0]; };

	// возвращение начальных свойств
	reset(){
		
		this.pos = [];
		this.velocity = new Vector( 1, 0 );

		this.innerColor = this.params.innerColor;
		this.outerColor = this.params.outerColor;
		this.blockSize = this.params.blockSize;

		this.pos.push( new Vector( this.params.startPos.x, this.params.startPos.y ) );
		for ( var i = 1; i < this.params.startLength; i++ )
			this.pos.push( new Vector( this.params.startPos.x - i, this.params.startPos.y ) )
		
	}

	update( currentVelocity ){
		this.changeVelocity( currentVelocity );
		this.moveSnake();
	};

	// добавление блока в змейку (рост змеи)
	addBlock( currentVelocity ){
		this.changeVelocity( currentVelocity );
		var length = this.pos.length;
		this.pos.push( new Vector( this.pos[length-1].x, this.pos[length-1].y));
		this.moveSnake();
	};

	// движение змейки на один блок
	moveSnake(){
		for ( var i = this.pos.length-1; i > 0; i-- )
			this.pos[i].set( this.pos[i-1].x, this.pos[i-1].y );
		this.pos[0].add( this.velocity );
	};

	// изменение направления
	changeVelocity( currentVelocity ){
		switch( currentVelocity ){
    		case 'right':
    			if ( this.velocity.x == 0 )
    				this.velocity.set( 1, 0 );
    			break;
        case 'left':
    			if ( this.velocity.x == 0 )
    				this.velocity.set( -1, 0 );
    			break;
        case 'up':
    			if ( this.velocity.y == 0 )
    				this.velocity.set( 0, -1 );
    			break;
        case 'down':
    			if ( this.velocity.y == 0 )
    				this.velocity.set( 0, 1 );
    			break;
    };
	};

	// отрисовка
	draw( ctx ){
		// draw body
		ctx.fillStyle = this.innerColor;
		for ( var i = 1; i < this.pos.length; i++ )
			ctx.fillRect( this.pos[i].x * this.blockSize + 1,
										this.pos[i].y * this.blockSize + 1,
										this.blockSize - 2,
										this.blockSize - 2 );

		// draw head
		ctx.fillStyle = this.outerColor;
		ctx.fillRect( this.pos[0].x * this.blockSize,
										this.pos[0].y * this.blockSize,
										this.blockSize,
										this.blockSize );
	};
}