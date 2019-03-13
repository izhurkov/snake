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

    // создает полупрозрачный темный фон
    initBack( text ){
        this.back = document.createElement('div');
        this.back.id = 'back_'+ text;
        this.back.className = "back";

        document.getElementsByTagName('body')[0].appendChild( this.back );
    };

    // создает форму с текстом
    initWindow( text ){
        this.wind = document.createElement('div');
        this.wind.id = 'wind_' + text;

        this.wind.innerHTML = text;
        this.wind.className = "wind";

        this.wind.style.textAlign = 'center';
        this.wind.style.left = '50%';
        this.wind.style.top = '50%';

        document.getElementsByTagName('body')[0].appendChild( this.wind );
    };

    // создает кнопки на форме
    addButton( button ){
        var input = document.createElement("input");
        input.type = "button";
        input.name = button.text;
        input.className = "buttons";
        input.value = button.text;
        input.style.display = 'block';
        var scope = this;
        input.onclick = button.func;

        this.wind.appendChild( input );
    };

    // показать форму
    show(){
        this.back.style.display = 'block';
        this.wind.style.display = 'block';
    };

    // скрыть
    hide(){
        this.back.style.display = 'none';
        this.wind.style.display = 'none';
    };
}
