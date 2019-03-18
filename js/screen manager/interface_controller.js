'use strict';

class InterfaceController {
	constructor(){
		
	};

	update( score ){
		$('.scoreCounter').html(score * 10);
	};
}
