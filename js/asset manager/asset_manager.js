'use strict';

class AssetManager{

	constructor(){
		this.assets = {};
		this.pulled_assets = [];
	}

	addAsset( asset_id, count, onCreate, onAdd, onRemove ){

		this.assets[ asset_id ] = {
			asset_id: asset_id,
			assets: [],
			onCreate: onCreate,
			onAdd: onAdd,
			onRemove: onRemove
		};

		var a = [];
		for( var i=0; i< count; i++ ){
			a.push( this.pullAsset( asset_id ) );
		}
		for( var i=0; i< a.length; i++ ){
			this.putAsset( a[i] );
		}
	}
	
	// положить ассет
	putAsset( asset ){
		var asset_obj = this.assets[asset.asset_id];
		if( !asset_obj ) return undefined;

		asset_obj.assets.push( asset );
	}

	// взять ассет
	pullAsset( asset_id ){
		var asset_obj = this.assets[asset_id];
		if( !asset_obj ) return undefined;

		var asset;
		
		if( asset_obj.assets.length ){
			asset = asset_obj.assets.pop();
		}else{
			asset = asset_obj.onCreate();
			// console.log( asset )
			asset.asset_id = asset_id;	
		}

		return asset;
	}
}
