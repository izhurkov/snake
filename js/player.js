'use strict';

class Player{

	constructor( config ){
		this.pos = [];
		this.velocity = new Vector( 1, 0 );

		this.innerColor = config.innerColor;
		this.outerColor = config.outerColor;
		this.blockSize = config.blockSize;

		this.pos.push( new Vector( config.startPos.x, config.startPos.y ) );
		for ( var i = 1; i < config.startLength; i++ )
			this.pos.push( new Vector( config.startPos.x - i, config.startPos.y ) )
	};

	get head() { return this.pos[0]; };

	update( currentVelocity ){
		this.changeVelocity( currentVelocity );
		this.moveSnake()
	};

	addBlock(){
		var length = this.pos.length;
		this.pos.push( new Vector( this.pos[length-1].x, this.pos[length-1].y))
		this.moveSnake()
	};

	moveSnake(){
		for ( var i = this.pos.length-1; i > 0; i-- )
			this.pos[i].set( this.pos[i-1].x, this.pos[i-1].y );
		this.pos[0].add( this.velocity );
	};

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