'use strict';

var modalWindow = {
	initBack: function(){
		var _back = document.getElementById( "back" );

		_back.style.display = 'inline';

		_back.onclick = function() { modalWindow.close(); }
	},

	initWindow: function( width, text ){
		var _window = document.getElementById( "window" );

    _window.style.display = 'inline';
    
    _window.innerHTML = text;

    _window.style.left = '50%';
    _window.style.top = '50%';

    _window.style.marginTop = -(_window.offsetHeight / 2) + 'px'; 
    _window.style.marginLeft = -(_window.offsetWidth / 2) + 'px';
	},

	show: function( width, text ){
		modalWindow.initBack();
    modalWindow.initWindow( width, text );
	},

	close: function(){
		document.getElementById( "back" ).style.display = 'none';
		document.getElementById( "window" ).style.display = 'none';
	}
}