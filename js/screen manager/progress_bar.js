'use strict';

class ProgressBar{

	constructor(){
		$('<div>', { 
		    id: 'outerProgressBar'
		}).append( $('<div>', { 
		    id: 'innerProgressBar'
		})).prependTo('#interface');

		$(document).on('preloader:progress', function(e, event_data){
			$('#innerProgressBar').css("width", event_data.loaded * 100 +"%");
		});

		$(document).on('preloader:complete', function(e){
			$('#outerProgressBar').fadeOut( 600 );
		});
	}
}

