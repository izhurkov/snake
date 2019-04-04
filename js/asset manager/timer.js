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

function Timer( duration, event ){
	this.duration = duration || 1;
	this.event = event || 'wow';
	this.isActive = false;
}

Timer.prototype = {
	start: function() {

		var seconds = this.duration;
		var duration = this.duration;
		var time;
		var scope = this;
		$( document ).trigger( this.event + ":start" );
		this.isActive = true;

		(function update(){

			if ( -seconds > 0 ){
				$( document ).trigger( scope.event + ":end");
				scope.isActive = false;
				return;
			}

			var updateId = requestAnimationFrame(update);

			var now = Date.now();
	    var delta = (now - (time || now)) * 0.001;
			time = now;
			seconds -= delta;
		}());
	}
}