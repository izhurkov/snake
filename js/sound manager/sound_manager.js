'use strict';

class SoundManager{

	constructor ( config, preloader ){

    this.sounds = [];
		// var scope = this;

		for ( var soundName in config.sounds ){

			var soundConfig = config.sounds[soundName];

			this.sounds[soundName] = PIXI.sound.add(soundName, {
			    url: preloader.queue.getItem( soundName ).src
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
	    $("#muted").attr( { 'value': muted ? "Unmute" : "Mute" } );
		});

		var scope = this;

		$( document )
			.on( 'game:bonusTaken', function(){
				scope.playSound( 'bonus_mp3' )
			})
			.on( 'game:start', function(){
				scope.playSound( 'music_mp3' )
			});
	};

	playSound( soundName ){
		if ( this.sounds[soundName] === undefined ) return;
		
		if ( this.sounds[soundName].isPlaying && this.sounds[soundName].loop )
			return;
		
		this.sounds[soundName].play();
	}

};
