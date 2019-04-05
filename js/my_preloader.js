'use strict';

class MyPreloader{

	constructor( manifest ){

		if ( !manifest ){
			console.log("manifest not loaded")
			return;
		}
	 	this.manifest = manifest;

	 	this.files = {};

	 	this.counter = 0;
	 	this.length = manifest.length;
	  	console.log(this.length);

	 	var scope = this;
	 	 $( document ).on("mypreloader:progress", function( event ){

	 	 	scope.counter++;
			$(document).trigger('preloader:progress', { event: event, data: scope, procent: scope.counter / scope.length } );
	 	 	if ( scope.counter >= scope.length)
	 	 		$( document ).trigger( 'mypreloader:complete' );
	  });

	  $( document ).on("mypreloader:complete", function( event, params ){
			$( document ).trigger('preloader:complete', { event: event, data: scope } );
	  });

	  for ( var filePath in manifest ){

	  	var file = manifest[filePath];
	  	var fileExt = this.getExt( manifest[filePath].src );

	  	if ( fileExt === 'png' || fileExt === 'jpeg'){
	  		this.files[file.id] = new Image();
				this.files[file.id].src = file.src;

				$(this.files[file.id]).on('load', function() {
			  	$( document ).trigger( 'mypreloader:progress' ); 
			  })
	  	}

	  	else if ( fileExt === 'mp3'){
	  		this.files[file.id] = new Audio( file.src );	
	  		$( document ).trigger( 'mypreloader:progress' ); 
	  	};

	  };

	};

	getExt( filename ){
	    var idx = filename.lastIndexOf('.');
	    return (idx < 1) ? "" : filename.substr(idx + 1);
	};

	getFileById( fileId ){
		return this.files[fileId];
	};
	
};

function dynamicallyLoadScript(url) {
    var script = document.createElement("script"); //Make a script DOM node
    script.src = url; //Set it's src to the provided URL
    document.head.appendChild(script); //Add it to the end of the head section of the page (could change 'head' to 'body' to add it to the end of the body section instead)
}



// function addScript(src){
// 	document.body.appendChild('<script type="text/JavaScript" src="', src, '"></script>');
// }