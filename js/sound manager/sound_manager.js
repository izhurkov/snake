'use strict';

class SoundManager{

	constructor ( config, preloader ){

    this.sounds = [];
		var scope = this;

		for ( var soundName in config.sounds ){

			var soundConfig = config.sounds[soundName];

			this.sounds[soundName] = PIXI.sound.add(soundName, {
			    url: preloader.queue.getResult( soundName ).src,
			    preload: true
			});

			var sound = this.sounds[soundName];

			for ( var configName in soundConfig ){
				if ( sound[configName] !== undefined){
					sound[configName] = soundConfig[configName];
				};
			};

		};

		$( document ).
			on( "game:start", function(e){
				scope.sounds['music_mp3'].stop();
				scope.sounds['music_mp3'].play();
			}).
			on( "game:lose", function(e){
				scope.sounds['game_over_mp3'].play();
			}).
			on( "game:bonusUp", function(e){
				scope.sounds['bonus_mp3'].play();
			});

		// this.sounds['bonus_mp3'].play();


		console.log( this.sounds )
	};
};