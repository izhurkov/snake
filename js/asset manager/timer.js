'use strict';

// class Timer{

// 	constructor( duration, event ){

// 		this.duration = duration;
// 		this.event = event;
// 	}

// 	start(){
// 		var seconds = this.duration;
// 		var duration = this.duration;
// 		var time;
// 		var scope = this;

// 		(function update(){

// 			var updateId = requestAnimationFrame(update);

// 			var now = Date.now();
//       var delta = (now - (time || now)) * 0.001;
//   		time = now;
// 			seconds -= delta;

// 			if ( -seconds > 0 ){
// 				$( document ).trigger( scope.event );
// 				return;
// 			}
// 		}());
// 	}
// }

function Timer( event ){
	this.event = event || 'wow';
	this.isActive = false;
	this.isStopped = false;
}

Timer.prototype = {

	start: function( duration) {

		var seconds = duration;
		var duration = duration;
		var time;
		var scope = this;
		$( document ).trigger( this.event + ":start" );
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