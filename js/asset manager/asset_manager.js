'use strict';

class AssetManager{

	constructor(){
		this.assets = {};
		this.pulled_assets = [];
	}

	addAsset( asset_id, count, onCreate, onAdd, onRemove ){

		this.assets[ asset_id ]	= null;
		this.assets[ asset_id ]	= {
			assets: [],
			asset_id: asset_id,
			onCreate: onCreate,
			onAdd: onAdd,
			onRemove, onRemove,
		}

		for(var i=0; i<count; i++)
			this.assets[asset_id].assets.push( onCreate() );
	}

	// взять ассет
	pullAsset( asset_id ){
		if ( this.assets[asset_id] === undefined ) return null;
		var assets = this.assets[asset_id].assets;
		if ( assets.length <= 0 ) return false;

		var pulledAsset = assets.pop();
		pulledAsset.asset_id = asset_id;

		this.pulled_assets.push( pulledAsset );
		return pulledAsset;
	}
	
	// положить ассет
	putAsset( asset ){
		var asset_id = asset.asset_id;
		if ( this.assets[asset_id] === undefined ) return null;
    var position = this.pulled_assets.indexOf(asset);

    // console.log( "put_asset", this.assets[asset_id] );

    var put_asset = null;

		if ( ~position )
			put_asset = this.pulled_assets.splice(position, 1);

		this.assets[ asset_id ].assets.push( put_asset[0] );
	}
}
