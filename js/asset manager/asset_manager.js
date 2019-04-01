'use strict';

class AssetManager {

	constructor( params ){

		this.entities = [];
		this.entityParams = [];
		this.params = Object.assign( {}, params );
	};	

	addEntity( entities ){

		for ( var entityName in entities ) {

			var entity = entities[entityName];
			
			if ( !entity.assetClass ) return;

			this.entities.push( new entity.assetClass( this.params ) );
			entity.name = entityName;
			this.entityParams.push( entity );
		};
	};

	update( params ){
		var entities = this.entities;
		for ( var i = 0; i < entities.length; i++ ){
			if ( entities[i].update ){
				entities[i].update( params );
			};
		};
	};

	setData( entityName, data ){

	}

	getData( entityName ){
		var entity = this.getEntityByName( entityName );
		if ( entity && entity.getData ){
			return entity.getData();
		}
	};

	cloneEntity( entityName, number ){
		var entities = this.entities;
		var entity = this.getEntityByName( entityName );

		if ( entity === undefined ) return;

		for ( var i = number - 1; i >= 0; i-- ) {
			entities.push( Object.assign( {}, entity ) );
		};
	};

	getEntityByName( entityName ){
		var entities = this.entityParams;
		for ( var i = 0; i < entities.length; i++ ){
			if ( entities[i].name === entityName ){
				return this.entities[i];
			};
		};
	};

};
