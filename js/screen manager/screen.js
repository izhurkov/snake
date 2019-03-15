'use strict';

class Screen{
	
	constructor( element, _data ){
		this.element = element;
		this.data = _data;
	};
	
	show( onComplete ){
		$(this.element)[this.data.showAnimation || 'fadeIn']( this.data.showDuration || 300, onComplete );
	};

	hide( onComplete ){
		$(this.element)[this.data.hideAnimation || 'fadeOut']( this.data.hideDuration || 300, onComplete );
	};
}