'use strict';

class Frog{

	constructor( params ){
		this.params = params;
		this.startPosition = new Vector();
		this.position = this.startPosition.clone();
	};

	jump( rockPosition ){
		var directions = [ [1, 0],[-1, 0], [0, 1], [0, -1] ];
		var rand = randomInteger( 0, 3 );
		var currentDirection = new Vector( directions[rand][0], directions[rand][1] )
		var newPosition = Vector.add( this.position, currentDirection );
		if ( newPosition.x <= 0 || newPosition.x >= this.params.areaX + 1 || 
					newPosition.y <= 0 || newPosition.y >= this.params.areaY + 1 || 
					Vector.equals( newPosition.x, rockPosition ) )
			return;
		this.position.set( newPosition );
	};
};