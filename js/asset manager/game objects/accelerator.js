'use strict';

class Accelerator {

	constructor( params ){
		this.acceleratorSpeedMultiply = params.acceleratorSpeedMultiply !== undefined ? params.acceleratorSpeedMultiply : 10;
		this.acceleratorDuration = params.acceleratorDuration !== undefined ? params.acceleratorDuration : 1;
		this.position = new Vector();
	};
};