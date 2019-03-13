'use strict';

class Screen{
	
	constructor( element ){
		this.element = element;
	};
	
	show(){
		this.element.style.display = 'block';
	};

	hide(){
		this.element.style.display = 'none';
	};
}