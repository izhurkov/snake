'use strict';

class ModalWindow{

  constructor( modalName, data ){
    this.data = data;
    $('#modal-window-container').append('<div class="modal-window"></div>');
    this.element = $('#modal-window-container').children().last();

    var template = Handlebars.compile(  `<div class='{{class}}'>{{text}}</div>` );

    var html = template( {class: 'back', text: ''} );
    $( '.modal-window:last' ).append( html );

    html = template( {class: 'wind', text: data.text } );
    $( '.modal-window:last' ).append( html );

    for ( var button in data.buttons ){
      this.addButton( button, data.buttons[button] );
    }

    var scope = this;
    $(document).on( 'button-click', function( e, data ){
      if (scope.data.buttons[data].onClick)
        scope.data.buttons[data].onClick();
    });
    
    $(this.element).css( { 'display': 'none' } );
  };

  addButton( buttonName, button ){

    var template = Handlebars.compile( `<input type='button' class='buttons' data-event="button-click:{{buttonName}}" value='{{text}}' >` );

    var htmlButton = template( { text: button.value, buttonName: buttonName} );
    $( '.wind' ).append( htmlButton );
  };

  show( onComplete ){
    $( this.element )[this.data.showAnimation || 'fadeIn']( this.data.showDuration || 300, onComplete );
  };

  hide( onComplete ){
    $( this.element )[this.data.hideAnimation || 'fadeOut']( this.data.hideDuration || 300, onComplete );
  };
}
