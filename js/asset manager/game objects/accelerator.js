'use strict';

class Accelerator {

	constructor( params ){
		this.acceleratorSpeedMultiply = params.acceleratorSpeedMultiply !== undefined ? params.acceleratorSpeedMultiply : 2;
		this.acceleratorDuration = params.acceleratorDuration !== undefined ? params.acceleratorDuration : 5;
		this.position = new Vector();
	};
};