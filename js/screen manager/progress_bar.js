'use strict';

class ProgressBar{

	constructor(){
		$('<div>', { 
		    id: 'outerProgressBar'
		}).append( $('<div>', { 
		    id: 'innerProgressBar'
		})).prependTo( document.body );

		$(document).on('preloader:progress', function(e, data){
			$('#innerProgressBar').css("width", data.procent * 100 +"%");
		});

		$(document).on('preloader:complete', function(e){
			$('#outerProgressBar').fadeOut( 600 );
		});
	}
}

