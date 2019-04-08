'use strict';

class ProgressBar{

	constructor(){
		$('<div>', { 
		    id: 'outerProgressBar'
		}).append( $('<div>', { 
		    id: 'innerProgressBar'
		})).prependTo( document.body );

		$(document).on('preloader:progress', function(e, data){
			var procent = data.event.loaded;
			$('#innerProgressBar').css("width", procent * 100 +"%");
		});

		$(document).on('preloader:complete', function(e){
			$('#outerProgressBar').fadeOut( 600 );
		});
	}
}

