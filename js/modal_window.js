'use strict';

class ModalWindow{

  constructor( element, data ){
    this.element = element;
    this.data = data;
    console.log(this.data);
    $('#modal-window-container').append('<div class="modal-window"></div>');

    var template = Handlebars.compile(  `<div class='{{class}}'>
          {{text}}
      </div>` );

    var htmlBack = template( {class: 'back', text: ''} );
    $( '.modal-window:last' ).append( htmlBack );

    var htmlWindow = template( {class: 'wind', text: data.text } );
    $( '.modal-window:last' ).append( htmlWindow );

    for ( var button in data.buttons ){
      console.log(data.buttons[button]);
      this.addButton( data.buttons[button] );
    }

    this.hide();
  };

  addButton( button ){

    var template = Handlebars.compile( `<input type='button' class='buttons' onclick='{{function}}' value='{{text}}' >` );


    var htmlBack = template( { text: button.text, function: button.func } );
    $( '.wind' ).append( htmlBack );
    console.log(htmlBack);
  };

  // показать форму
  show(){
    $( this.element )[this.data.showAnimation || 'fadeIn']( this.data.showDuration || 300, onComplete );
  };

  // скрыть
  hide(){
    $( this.element )[this.data.hideAnimation || 'fadeOut']( this.data.hideDuration || 300, onComplete );
  };
}
