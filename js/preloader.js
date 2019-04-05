'use strict';

class Preloader{

	constructor( manifest ){

		if ( !manifest ){
			console.log("manifest not loaded")
			return;
		}
	 	this.manifest = manifest;

	  this.queue = new createjs.LoadQueue(true);
	  
	  this.queue.loadManifest(this.manifest);

	  var scope = this;

	  this.queue.on("progress", function(event){
			$(document).trigger('preloader:progress', { event: event } );
	  });
	  this.queue.on("fileload", function(event){
			$(document).trigger('preloader:fileload', { event: event } );
	  });
	  this.queue.on("complete", function(event){
			$(document).trigger('preloader:complete', { event: event, queue: scope } );
	  });
	};
}