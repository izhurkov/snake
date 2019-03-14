'use strict';

class ModalWindow{
/// screen analog please
  constructor( text, buttons ){

    // this.back = null;
    // this.wind = null;

    // this.initBack( text );
    // this.initWindow( text );
    // 
    $('#modal-window-container').append('<div class="modal-window"></div>');




    var template = Handlebars.compile( this.getTemplate() );

    var htmlBack = template( {class: 'back', text: } );
    $( '.modal-window:last' ).appendChild( htmlBack );

    var htmlWindow = template( {class: 'wind', text: text } );
    $( '.modal-window:last' ).appendChild( htmlWindow );

    for ( var button in buttons ){
      this.addButton( buttons[button] );
    }

    this.hide();
  };

  getTemplate(){
    return 
      `<div class='{{class}}'>
          {{text}}
      </div>`;
  };

  getButtonTemplate(){
    return
      `<input type='button' class='buttons' onclick='{{function}}'>
          {{text}}
      </input>`;
  };
  // создает полупрозрачный темный фон
  // initBack( text ){
  //   this.back = document.createElement('div');
  //   this.back.className = "back";

  //   document.getElementsByTagName('body')[0].appendChild( this.back );
  // };

  // // создает форму с текстом
  // initWindow( text ){
  //   this.wind = document.createElement('div');
  //   this.wind.innerHTML = text;
  //   this.wind.className = "wind";

  //   document.getElementsByTagName('body')[0].appendChild( this.wind );
  // };

  // создает кнопки на форме
  addButton( button ){

    var template = Handlebars.compile( this.getButtonTemplate() );

    var htmlBack = template( { text: button.text, function: button.func } );
    $( 'modal-window-container' ).appendChild( htmlBack );

    // var input = document.createElement("input");
    // input.type = "button";
    // input.name = button.text;
    // input.className = "buttons";
    // input.value = button.text;
    // var scope = this;
    // input.onclick = button.func;

    // this.wind.appendChild( input );
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
