'use strict';

function Timer( event ){
	this.event = event || 'wow';
	this.isActive = false;
	this.isStopped = false;
}

Timer.prototype = {

	start: function( duration) {
		$( document ).trigger( this.event + ":start" );

		var seconds = duration;
		var duration = duration;
		var time;
		var scope = this;
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
			seconds -= delta;
		}());
	},

	stop: function() {

		this.isStopped = true;
	}
}