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
	  this.queue.on("progress", handleProgress);
	  this.queue.on("fileload", handleFileLoad);
	  this.queue.on("complete", handleComplete);

		function handleProgress(event){
			$(document).trigger('preloader:progress', event );
		}

		function handleFileLoad(event) {
			$(document).trigger('preloader:fileload');
		};

		function handleComplete(event) {
			$(document).trigger('preloader:complete', { queue: scope.queue } );
		};

	};
}