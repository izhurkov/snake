var AM = new AssetManager;
AM.addAsset(
	'bullet',
	100,
	function(){
	return new PIXI.Sprite();
	},
	function( asset ){
		asset.x = 0;
		asset.y = 0;
	},
	function(asset){
		asset.is_active = false;
	}
);


//
var bullet = AM.pullAsset('bullet');
stage.addChild( bullet );

AM.putAsset( bullet );




// ===========================================

class AssetManager(){

	construcor(){
		this.assets = {};
		this.pulled_assets = [];
	}

	addAsset( asset_id, count, onCreate, onAdd, onRemove ){

		this.assets[ asset_id ]	= {
			assets: [],
			asset_id: asset_id,
			onCreate: onCreate,
			onAdd: onAdd,
			onRemove, onRemove,
		}

		for(var i=0; i<count; i++) this.pullAsset( asset_id );

	}
	
	// положить ассет
	putAsset( asset ){



	}

	// взять ассет
	pullAsset( asset_id ){
		
	}

	//
	putAllAssets(){

	}

}