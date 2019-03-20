'use strict';

class Preloader{

	constructor( ){

		this.totalLoaded = 0;

	 	this.manifest = [
		  {src:"assets/Ground.png", id:"ground"},
		  {src:"assets/Wall.png", id:"wall"},
		  {src:"assets/snake-graphics.png", id:"snake-graphics"},
		  {src:"assets/high_resolution_image.jpg", id:"test0"},
		  {src:"assets/high_resolution_image.jpg", id:"test1"},
		  {src:"assets/high_resolution_image.jpg", id:"test2"},
		  {src:"assets/high_resolution_image.jpg", id:"test3"},
		  {src:"assets/high_resolution_image.jpg", id:"test4"},
		  {src:"assets/high_resolution_image.jpg", id:"test5"},
		  {src:"assets/high_resolution_image.jpg", id:"test6"},
		  {src:"assets/high_resolution_image.jpg", id:"test7"},
		  {src:"assets/high_resolution_image.jpg", id:"test8"},
		  {src:"assets/high_resolution_image.jpg", id:"test9"},
		  {src:"assets/bonus.mp3", id:"bonus_mp3"},
		  {src:"assets/game over.mp3", id:"game_over_mp3"},
		  {src:"assets/music.mp3", id:"music_mp3"}
		];

		$('<div>', { 
		    id: 'outerProgressBar'
		}).append( $('<div>', { 
		    id: 'innerProgressBar'
		})).appendTo('#interface');


	  this.queue = new createjs.LoadQueue(true);

	  this.queue.loadManifest(this.manifest);
	  var scope = this;
	  this.queue.on("progress", handleProgress);
	  this.queue.on("fileload", handleFileLoad);
	  this.queue.on("complete", handleComplete);

		//use event.loaded to get the percentage of the loading
		function handleProgress(event){
			$('#innerProgressBar').css("width", event.loaded * 100 +"%");
		}

		//triggered when an individual file completes loading
		function handleFileLoad(event) {

		};

		function handleComplete(event) {
			$('#outerProgressBar').fadeOut( 600 );

			$(document).trigger('preloader:complete', { queue: scope.queue } );
		};

	};
}