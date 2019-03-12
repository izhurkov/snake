'use strict';

class ModalWindow{

    constructor( text, buttons ){
        this.back = null;
        this.wind = null;

        this.initBack( text );
        this.initWindow( text );

        for ( var button in buttons){
        	this.addButton(buttons[button]);
        }
        this.hide();
    };

    initBack( text ){
        this.back = document.createElement('div');
        this.back.id = 'back_'+ text;
        this.back.className = "back";

        document.getElementsByTagName('body')[0].appendChild( this.back );
    };

    initWindow( text ){
        this.wind = document.createElement('div');
        this.wind.id = 'wind_' + text;

        this.wind.innerHTML = text;
        this.wind.className = "wind";

        this.wind.style.left = '40%';
        this.wind.style.top = '50%';

        document.getElementsByTagName('body')[0].appendChild( this.wind );
    };

    addButton( button ){
        var input = document.createElement("input");
        input.type = "button";
        input.name = button;
        input.className = "buttons";
        input.value = button;
        var scope = this;
        input.onclick = function(){ scope.hide() };

        this.wind.appendChild( input );
    };

    show(){
        this.back.style.display = 'inline';
        this.wind.style.display = 'inline';
    };

    hide(){
        this.back.style.display = 'none';
        this.wind.style.display = 'none';
    };
}
