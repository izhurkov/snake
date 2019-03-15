'use strict';

class ScreenManager {

	constructor ( screens, modals ){
    
    var scope = this;

    this.screens = [];
    this.modals = [];

    for( var screen_name in screens ){
      this.createScreen( screen_name, screens[screen_name] );
    };

    for( var modal_name in modals ){
      this.createModal( modal_name, modals[modal_name] );
    };

    $('[data-event]').each(function(i,e){
      var event = $(e).data('event').split(':');
      $(e).click(function(){ $(document).trigger( event[0], event[1] ); })
    });

    $(document).on( 'button-click', function( e, data ){
      var event = data.split('+');
      scope.modals[event[1]].data.buttons[event[0]].onClick();
    });

    $(document).on( 'show-screen', function( e, data ){
      scope.showScreen( data );
    });

    $(document).on( 'show-modal', function( e, data ){
      scope.showModal( data )
    });

    $(document).on( 'hide-modal', function( e, data ){
      scope.hideModal( data  );
    });

    // console.log(this.modals);

  };

  // добавить экран
  createScreen( target, data ){
    var screen = new Screen( document.getElementById( target ), data );
    this.screens[target] = screen;
  };

  createModal( target, data ){
    var modal = new ModalWindow( target, data );
    this.modals[target] = modal;
  };

  // показать экран
  showScreen( screen_name ){
    
    var scope = this;
    var screen = this.screens[screen_name];

    if( this.current_screen ) {
      this.hideScreen( function(){ scope.showScreen(screen_name); } );
      return;
    }

    this.current_screen = screen;

    if( screen.data.onShow ) screen.data.onShow();

    if( screen.data.afterShow )
      var afterShow = function(){ screen.data.afterShow() };

    screen.show( afterShow );
  };


  // скрыть экран
  hideScreen( onComplete ){
    if( !this.current_screen ) return;

    var screen = this.current_screen;
    if( screen.data.onHide ) screen.data.onHide();
    this.current_screen = undefined;

    screen.hide( onComplete );
  };

  showModal ( modal_name ){
    var modal = this.modals[modal_name];

    modal.data.onShow();

    modal.show();
  };

  hideModal ( modal_name ){
    var modal = this.modals[modal_name];

    modal.data.onHide();

    modal.hide();
  }

};
