'use strict';

class SoundManager{

	constructor ( config, preloader ){

    this.sounds = [];
		// var scope = this;

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

	// sound control
	$("#muted").on('click', function() {
    var muted = PIXI.sound.toggleMuteAll();
    $('canvas').focus();
    $("#muted").attr( { 'value': muted ? "unmute" : "mute" } );
	});

		// var muted = PIXI.sound.toggleMuteAll();
	};

	playSound( soundName ){
		if ( this.sounds[soundName] === undefined ) return;  
		if ( !this.sounds[soundName].isPlaying )
			this.sounds[soundName].play();
	}

};
