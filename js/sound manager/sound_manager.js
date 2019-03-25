'use strict';

class SoundManager{

	constructor ( config, preloader ){
		
    this.sounds = {};

    var scope = this;

		for ( var soundName in config.sounds ){

			var soundConfig = config.sounds[soundName];

			this.sounds[soundName] = PIXI.sound.Sound.from( preloader.queue.getResult( soundName ).src ) ;

			var sound = this.sounds[soundName];

			for ( var configName in soundConfig ){
				if ( sound[configName] !== undefined ){
					sound[configName] = soundConfig[configName];
				};
			};

			// if ( config.sounds[soundName].play !== undefined ){
			// 	$( document ).on( config.sounds[soundName].play, function(e){
			// 		scope.sounds[soundName].play();
			// 	});
			// };
			// if ( config.sounds[soundName].pause !== undefined ){
			// 	$( document ).on( config.sounds[soundName].pause, function(e){
			// 		scope.sounds[soundName].pause();
			// 	});
			// };
			// if ( config.sounds[soundName].stop !== undefined ){
			// 	$( document ).on( config.sounds[soundName].stop, function(e){
			// 		scope.sounds[soundName].stop();
			// 	});
			// };

		};

	};
};