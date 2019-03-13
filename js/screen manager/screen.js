'use strict';

class Screen{
	
	constructor( element, _data ){
		this.element = element;
		this.data = _data;
	};
	
	show( onComplete ){
		$(this.element)[this.data.showAnimation || 'fadeIn']( this.data.showDuration || 300, onComplete );
		// this.element.style.display = 'block';
		// if( onComplete ) onComplete();
	};

	hide( onComplete ){
		$(this.element)[this.data.hideAnimation || 'fadeOut']( this.data.hideDuration || 300, onComplete);
		// console.log("hide: ", onComplete );
		// this.element.style.display = 'none';
		// if( onComplete ) onComplete();
	};
}