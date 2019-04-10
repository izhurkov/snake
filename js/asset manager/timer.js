'use strict';

function Timer( event ){
	this.event = event || 'wow';
	this.isActive = false;
	this.isStopped = false;
	this.onPause = false;
}

Timer.prototype = {

	play: function( duration) {
		if ( !this.onPause ){
			$( document ).trigger( this.event + ":start" );
		}

		var seconds = duration;
		var duration = duration;
		var time;
		var scope = this;
		this.onPause = false;

		if ( this.isActive ) return;

		this.isActive = true;

		(function update(){

			if ( -seconds > 0 || scope.isStopped ){
				$( document ).trigger( scope.event + ":end");
				scope.isActive = false;
				scope.isStopped = false;
				return;
			}

			var updateId = requestAnimationFrame(update);

			var now = Date.now();
	    var delta = (now - (time || now)) * 0.001;
			time = now;
			if ( !scope.onPause )
				seconds -= delta;

		}());
	},

	continue: function(){
		if ( this.onPause )
			this.onPause = false;
	},

	stop: function() {
		if ( this.isActive )
			this.isStopped = true;
	},

	pause: function() {
		if ( this.isActive )
			this.onPause = true;
	}
}