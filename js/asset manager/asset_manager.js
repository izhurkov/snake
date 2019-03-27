'use strict';

class AssetManager {

	constructor( params ){
		this.entities = [];
	};	

	addEntity( entity ){
		this.entities.push( entity );
	};

	getEntity(){

	};

	update(){
		for ( var entityName in this.entities ){
			this.entities[entityName].update();
		}
	};

	getData(){
		var data = [];
		for ( var entityName in this.entities ){
			data.push( this.entities[entityName].getData() );
		}
		return data;
	};

};
