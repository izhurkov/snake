'use strict';

class StateMachine{
	
	constructor( states ){

		this._state = undefined;

		this.STATES = {};

		for ( var state_name in states ){
			this.STATES[state_name] = states[state_name];
		}
	}

	getState( ){
		return this._state;
	}

	setState( state_ ){

		if ( this.STATES[state_] === undefined ) return false;

		for (var state_name in this.STATES[state_].states ){
			console.log( state_, this.STATES[state_].states[state_name], this.getState() )
			if ( this.isState (this.STATES[state_].states[state_name]) ){
				this._switchState( state_, this.STATES[state_].onSet )
				return true;
			}
		}

		return false;
	};

	_switchState( state, onSuccess ){
		this._state = state;
		if( onSuccess ) onSuccess();
	};

	isState( state ){
		if( this._state == state ) return true;
		return false;
	};

};
